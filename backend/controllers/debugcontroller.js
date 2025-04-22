// controllers/debugController.js
export const debugTest = (req, res) => {
    console.log('🔥 Nuclear test route executed!');
    res.json({ 
      status: 'success',
      message: 'Nuclear test successful',
      verified: true,
      routesWorking: false // This should change to true when fixed
    });
  };