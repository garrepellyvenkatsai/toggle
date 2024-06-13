import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import mermaid from 'mermaid';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const MermaidDiagram = forwardRef(({ code }, ref) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (code) {
      mermaid.render('mermaid-diagram', code, (svgCode) => {
        containerRef.current.innerHTML = svgCode;
      });
    }
  }, [code]);

  useImperativeHandle(ref, () => ({
    async exportSVG() {
      try {
        const svgElement = containerRef.current.querySelector('svg');
        const svg = svgElement.outerHTML;
        return svg;
      } catch (error) {
        console.error('Error exporting Mermaid diagram as SVG', error);
        return null;
      }
    },
    async exportPNG() {
      try {
        const svgElement = containerRef.current.querySelector('svg');
        document.body.appendChild(svgElement);
        const canvas = await html2canvas(svgElement);
        document.body.removeChild(svgElement);
        return canvas.toDataURL('image/png');
      } catch (error) {
        console.error('Error exporting Mermaid diagram as PNG', error);
        return null;
      }
    },
    async exportPDF() {
      try {
        const svgElement = containerRef.current.querySelector('svg');
        document.body.appendChild(svgElement);
        const canvas = await html2canvas(svgElement);
        document.body.removeChild(svgElement);
        const pdf = new jsPDF('landscape');
        pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 280, 150);
        pdf.save('diagram.pdf');
      } catch (error) {
        console.error('Error exporting Mermaid diagram as PDF', error);
        return null;
      }
    }
  }));

  return <div ref={containerRef} style={{ height: '90vh', width: '100%' }} />;
});

export default MermaidDiagram;
