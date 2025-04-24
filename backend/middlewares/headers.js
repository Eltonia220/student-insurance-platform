export const headerSizeLimiter = (req, res, next) => {
    const headerSize = Buffer.byteLength(JSON.stringify(req.headers));
    if (headerSize > 32768) { // 32KB
      console.warn(`Oversized headers from ${req.ip}: ${headerSize} bytes`);
      return res.status(431).json({
        error: 'Header size exceeded',
        maxAllowed: '32KB',
        actual: `${(headerSize / 1024).toFixed(2)}KB`
      });
    }
    next();
  };