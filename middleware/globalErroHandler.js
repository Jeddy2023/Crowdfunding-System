export const globalError = (err, req, res, next) => {
    const stack = err?.stack;
    const message = err?.message;
    const statusCode = err?.statusCode ? err?.statusCode : 500;

    res.status(statusCode).json({
        stack,
        message,
    });
};

export const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    next(error)
}