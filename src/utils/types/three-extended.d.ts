declare module 'three/examples/jsm/controls/DragControls' {
    import { Camera, EventDispatcher, Intersection, Object3D, Raycaster, Vector2 } from 'three';

    export class DragControls extends EventDispatcher {
        constructor(objects: Object3D[], camera: Camera, domElement: HTMLElement);

        enabled: boolean;
        activate(): void;
        deactivate(): void;
        dispose(): void;
        getObjects(): Object3D[];
        transformGroup: boolean;

        // Event types
        addEventListener(type: 'dragstart' | 'dragend' | 'drag', listener: (event: any) => void): void;
        hasEventListener(type: string, listener: (event: any) => void): boolean;
        removeEventListener(type: string, listener: (event: any) => void): void;
        dispatchEvent(event: { type: string;[attachment: string]: any }): void;
    }
}
