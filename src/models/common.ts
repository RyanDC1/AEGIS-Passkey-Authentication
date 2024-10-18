export interface ServerError {
    message: string,
    /**
     * set if error is on a specific property
     * 
     * useful to show error message on form items
     */
    property?: string
}