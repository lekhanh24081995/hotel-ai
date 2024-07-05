interface CustomError {
  error_id: string;
  code: string;
  title: string;
  message: string;
  errors: [
    {
      error_id: string;
      code: string;
      title: string;
      message: string;
      field: string;
    }
  ];
}
