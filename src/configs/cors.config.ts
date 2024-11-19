const whiteLists = (process.env.UI as string)?.split(',') || '*';

const corsConfig = {
  origin: function (origin: any, callback: any) {
    // Insomnia, Postman support on development only
    if (
      (process.env.NODE_ENV === 'development' && !origin) ||
      whiteLists?.indexOf(origin) !== -1
    ) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS origin: ' + origin));
    }
  },
  credentials: true,
};

// console.log('corsConfig>>>', corsConfig);

export default corsConfig;
