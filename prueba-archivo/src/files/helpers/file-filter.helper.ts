import path from "path";

export const excelFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  callback: Function,
) => {
  if (!file) {
    return callback(new Error('no file provided'), false);
  }

  const mimeTypes : string[] = [
    'text/csv',
    'text/plain', // a veces los CSV vienen como text/plain
    'application/vnd.ms-excel', // .xls antiguo
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ] 

const extensionTypes = ['.csv', '.xls', '.xlsx', '.txt']
const ext = path.extname(file.originalname).toLowerCase()



  if(mimeTypes.includes(file.mimetype) || extensionTypes.includes(ext)){
    callback(null,true)
  }else{
     callback(new Error('Only CSV or Excel files are allowed'), false); 
  }
};
