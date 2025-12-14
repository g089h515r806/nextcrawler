'use client'
import  * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button"

export default function ExportItemsButton() {

  const exportItems = () => {
	/* convert state to workbook */
	const ws = XLSX.utils.table_to_sheet(document.getElementById('feed-items-table'));
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "FeedItems");
	/* generate XLSX file and send to client */
	XLSX.writeFile(wb, "feeditems.xlsx")
  };
  

  return <Button onClick={() => exportItems()}>导出</Button>
 
}
