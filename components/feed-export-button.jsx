'use client'
import  * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button"

export default function FeedExportButton() {

  const exportFeeds = () => {
	/* convert state to workbook */
	const ws = XLSX.utils.table_to_sheet(document.getElementById('feeds-table'));
	const wb = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(wb, ws, "Feeds");
	/* generate XLSX file and send to client */
	XLSX.writeFile(wb, "feeds.xlsx")
  };
  

  return <Button onClick={() => exportFeeds()}>导出</Button>
 
}
