import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import BpmnJS from 'bpmn-js/lib/Modeler';
import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const BpmnDiagram = forwardRef(({ xml }, ref) => {
  const containerRef = useRef(null);
  const bpmnModelerRef = useRef(null);

  useEffect(() => {
    const bpmnModeler = new BpmnJS({
      container: containerRef.current,
    });

    bpmnModelerRef.current = bpmnModeler;

    async function renderDiagram() {
      try {
        await bpmnModeler.importXML(xml);
        bpmnModeler.get('canvas').zoom('fit-viewport');
      } catch (error) {
        console.error('Error rendering BPMN diagram', error);
      }
    }

    if (xml) {
      renderDiagram();
    }

    return () => bpmnModeler.destroy();
  }, [xml]);

  useImperativeHandle(ref, () => ({
    async exportSVG() {
      try {
        const { svg } = await bpmnModelerRef.current.saveSVG();
        return svg;
      } catch (error) {
        console.error('Error exporting BPMN diagram as SVG', error);
        return null;
      }
    },
    async exportPNG() {
      try {
        const { svg } = await bpmnModelerRef.current.saveSVG();
        const svgElement = new DOMParser().parseFromString(svg, 'image/svg+xml').querySelector('svg');
        document.body.appendChild(svgElement); // Append to DOM to ensure rendering
        const canvas = await html2canvas(svgElement);
        document.body.removeChild(svgElement); // Remove after rendering
        return canvas.toDataURL('image/png');
      } catch (error) {
        console.error('Error exporting BPMN diagram as PNG', error);
        return null;
      }
    },
    async exportPDF() {
      try {
        const { svg } = await bpmnModelerRef.current.saveSVG();
        const svgElement = new DOMParser().parseFromString(svg, 'image/svg+xml').querySelector('svg');
        document.body.appendChild(svgElement); // Append to DOM to ensure rendering
        const canvas = await html2canvas(svgElement);
        document.body.removeChild(svgElement); // Remove after rendering
        const pdf = new jsPDF('landscape');
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 280, 150);
        pdf.save('diagram.pdf');
      } catch (error) {
        console.error('Error exporting BPMN diagram as PDF', error);
        return null;
      }
    }
  }));

  return <div ref={containerRef} style={{ height: '90vh', width: '100%' }} />;
});

export default BpmnDiagram;
