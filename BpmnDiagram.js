import React, { useEffect, useRef } from 'react';
import BpmnJS from 'bpmn-js/dist/bpmn-viewer.development.js';

const BpmnDiagram = ({ xml }) => {
  const diagramRef = useRef(null);
  const bpmnViewer = useRef(null);

  useEffect(() => {
    bpmnViewer.current = new BpmnJS({
      container: diagramRef.current,
    });

    return () => {
      if (bpmnViewer.current) {
        bpmnViewer.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (xml) {
      bpmnViewer.current.importXML(xml).then(() => {
        const canvas = bpmnViewer.current.get('canvas');
        canvas.zoom('fit-viewport');
        // watermark
        const watermark = diagramRef.current.querySelector('.bjs-powered-by');
        if (watermark) {
          watermark.style.display = 'none';
        }
      }).catch(err => console.error('Error rendering BPMN diagram:', err));
    }
  }, [xml]);

  return <div ref={diagramRef} className="diagramContainer"></div>;
};

export default BpmnDiagram;
