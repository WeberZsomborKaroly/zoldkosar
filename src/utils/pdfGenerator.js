import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

/**
 * Generates an invoice PDF for an order
 * @param {Object} order - The order data
 * @param {Object} user - The user data
 * @param {Object} invoiceData - Additional invoice data (company name, tax ID, etc.)
 * @returns {jsPDF} - The generated PDF document
 */
export const generateInvoice = (order, user, invoiceData) => {
    // Create a new PDF document
    const doc = new jsPDF();
    
    // Add company logo/header
    doc.setFontSize(20);
    doc.setTextColor(40, 40, 40);
    doc.text('SZÁMLA', 105, 20, { align: 'center' });
    
    // Add invoice details
    doc.setFontSize(10);
    doc.text(`Számla sorszáma: INV-${order.rendeles_szam}`, 14, 30);
    doc.text(`Kelt: ${new Date(order.letrehozva).toLocaleDateString('hu-HU')}`, 14, 35);
    doc.text(`Fizetés módja: Utánvét`, 14, 40);
    
    // Add seller details
    doc.setFontSize(12);
    doc.text('Eladó:', 14, 50);
    doc.setFontSize(10);
    doc.text('Webshop Kft.', 14, 55);
    doc.text('Adószám: 12345678-2-42', 14, 60);
    doc.text('Cím: 1234 Budapest, Példa utca 1.', 14, 65);
    doc.text('Telefonszám: +36 1 234 5678', 14, 70);
    
    // Add buyer details
    doc.setFontSize(12);
    doc.text('Vevő:', 120, 50);
    doc.setFontSize(10);
    doc.text(`${user?.vezeteknev || ''} ${user?.keresztnev || ''}`, 120, 55);
    
    if (invoiceData.ceg_nev) {
        doc.text(`${invoiceData.ceg_nev}`, 120, 60);
        doc.text(`Adószám: ${invoiceData.adoszam}`, 120, 65);
        doc.text(`${invoiceData.szallitasi_cim}`, 120, 70);
    } else {
        doc.text(`${invoiceData.szallitasi_cim}`, 120, 60);
    }
    
    // Add items table
    const tableColumn = ["Termék", "Mennyiség", "Egységár (Ft)", "Nettó (Ft)", "ÁFA (27%)", "Bruttó (Ft)"];
    const tableRows = [];
    
    // Calculate totals
    let totalNet = 0;
    let totalVat = 0;
    let totalGross = 0;
    
    // Add products to table
    order.termekek.forEach(item => {
        const netPrice = Math.round(item.egysegar / 1.27);
        const vatAmount = item.egysegar - netPrice;
        const netTotal = netPrice * item.mennyiseg;
        const vatTotal = vatAmount * item.mennyiseg;
        const grossTotal = item.egysegar * item.mennyiseg;
        
        totalNet += netTotal;
        totalVat += vatTotal;
        totalGross += grossTotal;
        
        tableRows.push([
            item.nev,
            item.mennyiseg,
            item.egysegar.toLocaleString('hu-HU'),
            netTotal.toLocaleString('hu-HU'),
            vatTotal.toLocaleString('hu-HU'),
            grossTotal.toLocaleString('hu-HU')
        ]);
    });
    
    // Add summary row
    tableRows.push([
        "Összesen:",
        "",
        "",
        totalNet.toLocaleString('hu-HU'),
        totalVat.toLocaleString('hu-HU'),
        totalGross.toLocaleString('hu-HU')
    ]);
    
    // Generate the table
    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 80,
        theme: 'grid',
        styles: {
            fontSize: 8,
            cellPadding: 3,
            lineColor: [80, 80, 80],
            lineWidth: 0.1
        },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold'
        },
        footStyles: {
            fillColor: [240, 240, 240],
            fontStyle: 'bold'
        }
    });
    
    // Add footer notes
    const finalY = doc.lastAutoTable.finalY || 150;
    doc.setFontSize(8);
    doc.text('Ez a számla a 2007. évi CXXVII. törvény alapján elektronikusan kiállított hiteles bizonylat.', 14, finalY + 10);
    doc.text('A számla aláírás és bélyegző nélkül is érvényes.', 14, finalY + 15);
    
    return doc;
};
