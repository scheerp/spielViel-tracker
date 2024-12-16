export interface ApiError {
  detail: {
    error_code: string;
    message: string;
    details?: Record<string, unknown>;
  };
}

export interface BarcodeConflictError extends ApiError {
  detail: {
    error_code: 'BARCODE_CONFLICT';
    message: string;
    details: {
      id: number;
      name: string;
      ean: string;
      thumbnail_url?: string;
    };
  };
}

export type AppError = ApiError | BarcodeConflictError;
