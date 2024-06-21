const errorHandler = (err, req, res, next) => {
    console.error(err);
    if (err.status) {
        return res.status(err.status).json({ err });
    }
    return res.status(500).json({ err });
};
export default errorHandler;
