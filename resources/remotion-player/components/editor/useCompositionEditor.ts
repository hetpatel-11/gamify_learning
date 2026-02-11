import { useState, useCallback, useRef } from "react";
import type {
  CompositionData,
  SceneData,
  ElementData,
} from "../../../../types";

export type CompositionUpdater = {
  composition: CompositionData;
  isDirty: boolean;
  selectedSceneIndex: number;
  selectedElementId: string | null;
  setSelectedSceneIndex: (index: number) => void;
  setSelectedElementId: (id: string | null) => void;
  updateScene: (sceneIndex: number, patch: Partial<SceneData>) => void;
  updateElement: (
    sceneIndex: number,
    elementId: string,
    patch: Partial<ElementData>
  ) => void;
  addElement: (sceneIndex: number, element: ElementData) => void;
  removeElement: (sceneIndex: number, elementId: string) => void;
  resetTo: (composition: CompositionData) => void;
  getJSON: () => string;
};

export function useCompositionEditor(
  initial: CompositionData
): CompositionUpdater {
  const [composition, setComposition] = useState<CompositionData>(
    () => structuredClone(initial)
  );
  const [isDirty, setIsDirty] = useState(false);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState(0);
  const [selectedElementId, setSelectedElementId] = useState<string | null>(
    null
  );
  const initialRef = useRef(initial);

  const updateComposition = useCallback(
    (updater: (draft: CompositionData) => CompositionData) => {
      setComposition((prev) => {
        const next = updater(structuredClone(prev));
        setIsDirty(true);
        return next;
      });
    },
    []
  );

  const updateScene = useCallback(
    (sceneIndex: number, patch: Partial<SceneData>) => {
      updateComposition((draft) => {
        if (draft.scenes[sceneIndex]) {
          draft.scenes[sceneIndex] = { ...draft.scenes[sceneIndex], ...patch };
        }
        return draft;
      });
    },
    [updateComposition]
  );

  const updateElement = useCallback(
    (sceneIndex: number, elementId: string, patch: Partial<ElementData>) => {
      updateComposition((draft) => {
        const scene = draft.scenes[sceneIndex];
        if (!scene) return draft;
        const idx = scene.elements.findIndex((e) => e.id === elementId);
        if (idx !== -1) {
          scene.elements[idx] = { ...scene.elements[idx], ...patch } as ElementData;
        }
        return draft;
      });
    },
    [updateComposition]
  );

  const addElement = useCallback(
    (sceneIndex: number, element: ElementData) => {
      updateComposition((draft) => {
        if (draft.scenes[sceneIndex]) {
          draft.scenes[sceneIndex].elements.push(element);
        }
        return draft;
      });
    },
    [updateComposition]
  );

  const removeElement = useCallback(
    (sceneIndex: number, elementId: string) => {
      updateComposition((draft) => {
        if (draft.scenes[sceneIndex]) {
          draft.scenes[sceneIndex].elements =
            draft.scenes[sceneIndex].elements.filter((e) => e.id !== elementId);
        }
        return draft;
      });
      setSelectedElementId((prev) => (prev === elementId ? null : prev));
    },
    [updateComposition]
  );

  const resetTo = useCallback((comp: CompositionData) => {
    const cloned = structuredClone(comp);
    initialRef.current = cloned;
    setComposition(cloned);
    setIsDirty(false);
    setSelectedSceneIndex(0);
    setSelectedElementId(null);
  }, []);

  const getJSON = useCallback(() => {
    return JSON.stringify(composition, null, 2);
  }, [composition]);

  return {
    composition,
    isDirty,
    selectedSceneIndex,
    selectedElementId,
    setSelectedSceneIndex,
    setSelectedElementId,
    updateScene,
    updateElement,
    addElement,
    removeElement,
    resetTo,
    getJSON,
  };
}
