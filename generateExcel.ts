import * as fs from 'fs'
import * as XLSX from 'xlsx'

const swaggerFilePath = './swagger.json' // Swagger JSON 파일 경로
const outputExcelPath = './api_list.xlsx' // 출력할 Excel 파일 경로

function generateExcelFromSwagger() {
    const swaggerData = JSON.parse(fs.readFileSync(swaggerFilePath, 'utf8'))

    const apiList = Object.entries(swaggerData.paths).flatMap(([path, methods]: any) =>
        Object.entries(methods).map(([method, details]: any) => ({
            Method: method.toUpperCase(),
            URL: path,
            Summary: details.summary || '',
            Description: details.description || '',
            Parameters: (details.parameters || []).map((param: any) => `${param.name}: ${param.description}`).join(', '),
            Responses: JSON.stringify(details.responses || {}, null, 2),
        }))
    )

    const worksheet = XLSX.utils.json_to_sheet(apiList)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, 'APIs')
    XLSX.writeFile(workbook, outputExcelPath)

    console.log(`Excel file has been created at ${outputExcelPath}`)
}

generateExcelFromSwagger()
