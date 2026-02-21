import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import GlobalAveragePooling2D, Dense, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import matplotlib.pyplot as plt
import numpy as np
import json
import os

# ── Config ──────────────────────────────────────────────────────────────────
DATASET_DIR = "dataset"
IMG_SIZE = (224, 224)
BATCH_SIZE = 16  # small because our dataset is small
EPOCHS = 50      # early stopping will kick in before this
SEED = 42

# ── Data Generators with Heavy Augmentation ──────────────────────────────────
# Because we only have ~181 images, augmentation is critical
train_datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2,
    rotation_range=30,
    width_shift_range=0.2,
    height_shift_range=0.2,
    shear_range=0.2,
    zoom_range=0.3,
    horizontal_flip=True,
    vertical_flip=True,
    brightness_range=[0.7, 1.3],
    fill_mode='nearest'
)

val_datagen = ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2
)

train_generator = train_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training',
    seed=SEED
)

val_generator = val_datagen.flow_from_directory(
    DATASET_DIR,
    target_size=IMG_SIZE,
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation',
    seed=SEED
)

# Save class indices so Flask API knows which index = which label
class_indices = train_generator.class_indices
class_labels = {v: k for k, v in class_indices.items()}
print("Class mapping:", class_labels)

with open("class_labels.json", "w") as f:
    json.dump(class_labels, f)

# ── Build Model ──────────────────────────────────────────────────────────────
base_model = MobileNetV2(
    input_shape=(224, 224, 3),
    include_top=False,
    weights='imagenet'
)

# Freeze base layers first - we'll fine-tune later
base_model.trainable = False

x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
x = Dropout(0.5)(x)
x = Dense(64, activation='relu')(x)
x = Dropout(0.3)(x)
output = Dense(len(class_labels), activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=output)

model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# ── Phase 1: Train Head Only ─────────────────────────────────────────────────
print("\n── Phase 1: Training classification head ──")

callbacks = [
    EarlyStopping(monitor='val_accuracy', patience=8, restore_best_weights=True),
    ModelCheckpoint('best_model.keras', monitor='val_accuracy', save_best_only=True)
]

history1 = model.fit(
    train_generator,
    epochs=25,
    validation_data=val_generator,
    callbacks=callbacks
)

# ── Phase 2: Fine-tune Top Layers of Base Model ──────────────────────────────
print("\n── Phase 2: Fine-tuning top layers ──")

# Unfreeze the top 30 layers of MobileNetV2
base_model.trainable = True
for layer in base_model.layers[:-30]:
    layer.trainable = False

# Recompile with lower learning rate for fine-tuning
model.compile(
    optimizer=tf.keras.optimizers.Adam(learning_rate=0.0001),
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

callbacks2 = [
    EarlyStopping(monitor='val_accuracy', patience=10, restore_best_weights=True),
    ModelCheckpoint('best_model.keras', monitor='val_accuracy', save_best_only=True)
]

history2 = model.fit(
    train_generator,
    epochs=EPOCHS,
    validation_data=val_generator,
    callbacks=callbacks2
)

# ── Results ──────────────────────────────────────────────────────────────────
val_loss, val_acc = model.evaluate(val_generator)
print(f"\n✅ Final Validation Accuracy: {val_acc:.2%}")
print(f"✅ Final Validation Loss: {val_loss:.4f}")

# Plot training history
fig, axes = plt.subplots(1, 2, figsize=(12, 4))

# Combine histories
acc = history1.history['accuracy'] + history2.history['accuracy']
val_acc_plot = history1.history['val_accuracy'] + history2.history['val_accuracy']
loss = history1.history['loss'] + history2.history['loss']
val_loss_plot = history1.history['val_loss'] + history2.history['val_loss']

axes[0].plot(acc, label='Train Accuracy')
axes[0].plot(val_acc_plot, label='Val Accuracy')
axes[0].set_title('Accuracy')
axes[0].legend()

axes[1].plot(loss, label='Train Loss')
axes[1].plot(val_loss_plot, label='Val Loss')
axes[1].set_title('Loss')
axes[1].legend()

plt.tight_layout()
plt.savefig('training_results.png')
plt.show()
print("📊 Training chart saved as training_results.png")

# ── Export to TFLite ─────────────────────────────────────────────────────────
print("\n🎉 All done! Files saved: best_model.keras, class_labels.json, training_results.png")