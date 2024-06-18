import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import excel from 'exceljs';
export const helperExports = () => {
	const workSheetName = 'Worksheet-1';
    const workbook = new excel.Workbook();
	const exportarExcelGastos = async (data) => {
		data = data.map((e) => {
			return {
				fec_registro: e.fec_registro,
				Proveedores: e.tb_Proveedor?.razon_social_prov,
				gasto: e.tb_parametros_gasto?.nombre_gasto,
				Descripcion: e.descripcion,
				moneda: e.moneda,
				monto: e.monto,
			};
		});
		try {
			const fileName = 'cssTest';

			// creating one worksheet in workbook
			const worksheet = workbook.addWorksheet(workSheetName);

			// add worksheet columns
			// each columns contains header and its mapping key from data
			worksheet.columns = [
				{ header: 'First Name', key: 'fec_registro' },
				{ header: 'Last Name', key: 'Proveedores' },
				{ header: 'Purchase Price', key: 'gasto' },
				{ header: 'Payments Made', key: 'Descripcion' },
				{ header: 'Payments Made', key: 'moneda' },
				{ header: 'Payments Made', key: 'monto' },
			];

			// updated the font for first row.
			worksheet.getRow(1).font = { bold: true };

			// loop through all of the columns and set the alignment with width.
			worksheet.columns.forEach((column) => {
				column.width = column.header.length + 5;
				column.alignment = { horizontal: 'center' };
			});

			// loop through data and add each one to worksheet
			data.forEach((singleData) => {
				worksheet.addRow(singleData);
			});

			// loop through all of the rows and set the outline style.
			worksheet.eachRow({ includeEmpty: false }, (row) => {
				// store each cell to currentCell
				const currentCell = row._cells;

				// loop through currentCell to apply border only for the non-empty cell of excel
				currentCell.forEach((singleCell) => {
					// store the cell address i.e. A1, A2, A3, B1, B2, B3, ...
					const cellAddress = singleCell._address;

					// apply border
					worksheet.getCell(cellAddress).border = {
						top: { style: 'thin' },
						left: { style: 'thin' },
						bottom: { style: 'thin' },
						right: { style: 'thin' },
					};
				});
			});

			// write the content using writeBuffer
			const buf = await workbook.xlsx.writeBuffer();

			// download the processed file
			saveAs(new Blob([buf]), `${fileName}.xlsx`);
		} catch (error) {
			console.error('<<<ERRROR>>>', error);
			console.error('Something Went Wrong', error.message);
		} finally {
			// removing worksheet's instance to create new one
			workbook.removeWorksheet(workSheetName);
		}
	};
	const exportExcelPersonalizadoGastos = (data, fileName) => {
		console.log(data);
		const dataSet = data.map((e) => {
			return {
				'Fecha de registro': e.fec_registro,
				Proveedores: e.tb_Proveedor?.razon_social_prov,
				'Nombre del gasto': e.tb_parametros_gasto?.nombre_gasto,
				Descripcion: e.descripcion,
				MONEDA: e.moneda,
				MONTO: e.monto,
			};
		});
		try {
			// Crea una hoja de cálculo
			const worksheet = XLSX.utils.json_to_sheet(dataSet);

			// Aplicar estilos a las celdas
			worksheet['A1'].s = { fill: { patternType: 'solid', fgColor: { rgb: '255, 0, 0' } } }; // Color rojo en A1

			// Crea un libro de trabajo
			const workbook = XLSX.utils.book_new();
			XLSX.utils.book_append_sheet(workbook, worksheet, 'Gastos personalizado');

			// Función auxiliar para convertir un string a ArrayBuffer
			const s2ab = (s) => {
				const buf = new ArrayBuffer(s.length);
				const view = new Uint8Array(buf);
				for (let i = 0; i !== s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
				return buf;
			};

			// Generar un blob binario a partir del libro de trabajo
			const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

			// Convertir el blob a un archivo de tipo Blob y descargarlo
			const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
			saveAs(blob, 'usuarios.xlsx');

			// // Escribe el archivo
			// writeFile(workbook, `${fileName}.xlsx`);
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	};
	return {
		exportExcelPersonalizadoGastos,
		exportarExcelGastos,
	};
};
