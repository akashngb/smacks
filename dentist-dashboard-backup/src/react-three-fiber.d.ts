import '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: ReactThreeFiber.MeshProps;
      group: ReactThreeFiber.GroupProps;
      pointLight: ReactThreeFiber.PointLightProps;
      directionalLight: ReactThreeFiber.DirectionalLightProps;
      ambientLight: ReactThreeFiber.AmbientLightProps;
      sphereGeometry: ReactThreeFiber.SphereGeometryProps;
      meshStandardMaterial: ReactThreeFiber.MeshStandardMaterialProps;
      primitive: any;
      Html: any;
    }
  }
}