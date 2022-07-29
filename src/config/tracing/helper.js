export const tracing = (req, text, data) =>
{

    const { transactionid, serviceid } = req.headers;
    const method = req.method.toUpperCase();
    const content = JSON.stringify(data || req.body);
    const message = `Request to ${method} # ${text} \n Data: ${content}\n transactionId: ${transactionid}\n serviceId:     ${serviceid}`;

    console.info(
        '\n',
        '-----------------------------------------------------------------------------\n',
        `${message}\n`,
        '-----------------------------------------------------------------------------\n',
    );

    return data;

};
