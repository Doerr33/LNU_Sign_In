// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const log = cloud.logger()

const uploadFile = async function (arrayBuffer, path) {
    let {
        fileID
    } = await cloud.uploadFile({
        cloudPath: path,
        fileContent: arrayBuffer,
    })
    return fileID
}

// 云函数入口函数
exports.main = async (event, context) => {
    const wxContext = cloud.getWXContext()
    const type = event.type
    let createID = event.createID
    console.log(createID);
    log.info({
        type
    })

    let result
    switch (type) {
        case "qr":
            try {
                let {
                    buffer
                } = await cloud.openapi.wxacode.createQRCode({
                    path: 'pages/add/add?openid=' + createID,
                    width: 430
                })
                fileID = await uploadFile(buffer, 'qr.jpg')
                return fileID
            } catch (err) {
                log.error({
                    err
                })
                return err
            }
            break;
        case 'miniapp':
            try {
                let {
                    buffer
                } = await cloud.openapi.wxacode.get({
                    path: 'pages/add/add?openid=' + createID,
                    scene: openid,
                    width: 430
                })
                fileID = await uploadFile(buffer, 'miniapp.jpg')
                return fileID
            } catch (err) {
                log.error({
                    err
                })
                return err
      }
            break;
        case 'unlimited':
            try {
                let {
                    buffer
                } = await cloud.openapi.wxacode.getUnlimited({
                    page: 'pages/add/add',
                    scene: JSON.stringify(event.createID),
                    checkPath: false,
                })
                fileID = await uploadFile(buffer, 'unlimited.jpg')
                return fileID
            } catch (err) {
                log.error({
                    err
                })
                return err
            }
            break;
    }

}