export interface ApiError {
  detail: {
    error_code: string;
    message: string;
    detailed_message?: string;
  };
}

export interface BarcodeConflictError extends ApiError {
  detail: {
    error_code: 'BARCODE_CONFLICT';
    message: string;
    detailed_message?: string;
    ean_details: {
      id: number;
      name: string;
      ean: string;
      thumbnail_url: string;
    };
  };
}

export type AppError = ApiError | BarcodeConflictError;
