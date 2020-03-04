/* eslint-disable no-process-env */

export const config = {
    country: "COUNTRY" in process.env ? process.env.COUNTRY
                                      : null,
};
