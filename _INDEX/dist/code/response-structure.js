ResultHeader headerInfo = new ResultHeader
{
    processInfo = {status = bool, message = string },
    methodInfo = { status = bool, message = string },
    userInfo = {},
    seoInfo = new SeoInfo
    {
        title = "",
        description = "",
        keywords = ""
    },
    i18Info = new I18Info {
        languageCode = "",
        countryCode = "",
        direction = ""
    },
    appVersion = "",
    responseId = ""
}

bodyInfo = new
{
    // any object, key val pair
};

result = new ResultInfo
{
    header = headerInfo,
    body = bodyInfo
}
