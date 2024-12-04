import { ConfidentialClientApplication, LogLevel } from '@azure/msal-node'
import { Client } from '@microsoft/microsoft-graph-client'
import { ChangeNotificationCollection } from '@microsoft/microsoft-graph-types'
import { Body, Controller, Headers, Post, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import { createRemoteJWKSet, jwtVerify } from 'jose'

@Controller('webhook')
export class Webhook {
  private time = 1
  @Post('google')
  async index(@Body() body: any, @Headers() headers: any) {
    console.log('EVENTTTTT')
    console.log('Webhook ~ index ~ headers:', headers)

    //* CREATE MS EVENT
    const msalClient = new ConfidentialClientApplication({
      auth: {
        clientId: process.env.OAUTH_CLIENT_ID || '',
        authority: `${process.env.OAUTH_AUTHORITY}/${process.env.OAUTH_TENANT_ID}`,
        clientSecret: process.env.OAUTH_CLIENT_SECRET
      },
      system: {
        loggerOptions: {
          loggerCallback(logLevel, message, containsPii) {
            console.log(message)
          },
          piiLoggingEnabled: false,
          logLevel: LogLevel.Error
        }
      }
    })

    const client = Client.init({
      // Implement an auth provider that gets a token
      // from the app's MSAL instance
      authProvider: async (done) => {
        try {
          // Get a token using client credentials
          const response = await msalClient.acquireTokenByClientCredential({
            scopes: [
              'https://graph.microsoft.com/.default'
              // 'https://graph.microsoft.com/User.Read.All'
            ]
          })
          if (!response) return done(new Error('Error: No response'), null)
          // First param to callback is the error,
          // Set to null in success case
          done(null, response.accessToken)
        } catch (err) {
          console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)))
          done(err, null)
        }
      }
    })

    client.api('/users/hieuptm@iceteasoftware.com/events').post(
      {
        subject: '2 [ITS] - TLG MA Kick off', // summary
        start: {
          // start
          dateTime: '2024-12-07T05:09:09.390Z',
          timeZone: 'SE Asia Standard Time'
        },
        end: {
          // end
          dateTime: '2024-12-07T06:09:09.390Z',
          timeZone: 'SE Asia Standard Time'
        },
        body: {
          // description
          contentType: 'html',
          content:
            '<html>\r\n<head>\r\n<meta http-equiv="Content-Type" content="text/html; charset=utf-8">\r\n<meta name="viewport" content="width=device-width,initial-scale=1">\r\n<meta name="color-scheme" content="light dark">\r\n<meta name="supported-color-schemes" content="light dark">\r\n<style>\r\n<!--\r\nbody, html\r\n\t{font-family:Roboto,Helvetica,Arial,sans-serif}\r\nbody\r\n\t{margin:0;\r\n\tpadding:0}\r\n#outlook a\r\n\t{padding:0}\r\n.ReadMsgBody\r\n\t{width:100%}\r\n.ExternalClass\r\n\t{width:100%}\r\n.ExternalClass *\r\n\t{line-height:100%}\r\ntable, td\r\n\t{}\r\nimg\r\n\t{border:0;\r\n\theight:auto;\r\n\tline-height:100%;\r\n\toutline:none;\r\n\ttext-decoration:none}\r\np\r\n\t{display:block;\r\n\tmargin:13px 0}\r\n-->\r\n</style><style>\r\n<!--\r\n@media only screen and (max-width:580px) {\r\n\r\n\t}\r\n-->\r\n</style><style>\r\n<!--\r\nbody, html\r\n\t{font-family:Roboto,Helvetica,Arial,sans-serif}\r\n@font-face\r\n\t{font-family:\'Roboto\';\r\n\tfont-style:normal;\r\n\tfont-weight:400}\r\n@font-face\r\n\t{font-family:\'Roboto\';\r\n\tfont-style:normal;\r\n\tfont-weight:500}\r\n@font-face\r\n\t{font-family:\'Roboto\';\r\n\tfont-style:normal;\r\n\tfont-weight:700}\r\n@font-face\r\n\t{font-family:\'Material Icons Extended\';\r\n\tfont-style:normal;\r\n\tfont-weight:400}\r\n@font-face\r\n\t{font-family:\'Google Material Icons\';\r\n\tfont-style:normal;\r\n\tfont-weight:400}\r\n.google-material-icons\r\n\t{font-family:\'Google Material Icons\';\r\n\tfont-weight:normal;\r\n\tfont-style:normal;\r\n\tfont-size:24px;\r\n\tline-height:1;\r\n\tletter-spacing:normal;\r\n\ttext-transform:none;\r\n\tdisplay:inline-block;\r\n\twhite-space:nowrap;\r\n\tword-wrap:normal;\r\n\tdirection:ltr}\r\n@font-face\r\n\t{font-family:\'Google Material Icons Filled\';\r\n\tfont-style:normal;\r\n\tfont-weight:400}\r\n.google-material-icons-filled\r\n\t{font-family:\'Google Material Icons Filled\';\r\n\tfont-weight:normal;\r\n\tfont-style:normal;\r\n\tfont-size:24px;\r\n\tline-height:1;\r\n\tletter-spacing:normal;\r\n\ttext-transform:none;\r\n\tdisplay:inline-block;\r\n\twhite-space:nowrap;\r\n\tword-wrap:normal;\r\n\tdirection:ltr}\r\n@font-face\r\n\t{font-family:\'Google Sans\';\r\n\tfont-style:normal;\r\n\tfont-weight:400}\r\n@font-face\r\n\t{font-family:\'Google Sans\';\r\n\tfont-style:normal;\r\n\tfont-weight:500}\r\n@font-face\r\n\t{font-family:\'Google Sans\';\r\n\tfont-style:normal;\r\n\tfont-weight:700}\r\n-->\r\n</style><style>\r\n<!--\r\n.body-container\r\n\t{padding-left:16px;\r\n\tpadding-right:16px}\r\n-->\r\n</style><style>\r\n<!--\r\nu + .body .body-container, body[data-outlook-cycle] .body-container, #MessageViewBody .body-container\r\n\t{padding-left:0;\r\n\tpadding-right:0}\r\n-->\r\n</style><style>\r\n<!--\r\n@media only screen and (min-width:580px) {\r\n.column-per-37\r\n\t{width:37%!important;\r\n\tmax-width:37%}\r\n.column-per-63\r\n\t{width:63%!important;\r\n\tmax-width:63%}\r\n\r\n\t}\r\n-->\r\n</style><style>\r\n<!--\r\n.appointment-buttons th\r\n\t{display:block;\r\n\tclear:both;\r\n\tfloat:left;\r\n\tmargin-top:12px}\r\n.appointment-buttons th a\r\n\t{float:left}\r\n#MessageViewBody .appointment-buttons th\r\n\t{margin-top:24px}\r\n-->\r\n</style><style>\r\n<!--\r\n@media only screen and (max-width:580px) {\r\ntable.full-width-mobile\r\n\t{width:100%!important}\r\ntd.full-width-mobile\r\n\t{width:auto!important}\r\n\r\n\t}\r\n-->\r\n</style><style>\r\n<!--\r\n.main-container-inner, .info-bar-inner\r\n\t{padding:12px 16px!important}\r\n.main-column-table-ltr\r\n\t{padding-right:0!important}\r\n.main-column-table-rtl\r\n\t{padding-left:0!important}\r\n@media only screen and (min-width:580px) {\r\n.main-container-inner\r\n\t{padding:24px 32px!important}\r\n.info-bar-inner\r\n\t{padding:12px 32px!important}\r\n.main-column-table-ltr\r\n\t{padding-right:32px!important}\r\n.main-column-table-rtl\r\n\t{padding-left:32px!important}\r\n.appointment-buttons th\r\n\t{display:table-cell;\r\n\tclear:none}\r\n\r\n\t}\r\n.primary-text\r\n\t{color:#3c4043!important}\r\n.secondary-text, .phone-number a\r\n\t{color:#70757a!important}\r\n.accent-text\r\n\t{color:#1a73e8!important}\r\n.accent-text-dark\r\n\t{color:#185abc!important}\r\n.grey-button-text, .attachment-chip a\r\n\t{color:#5f6368!important}\r\n.primary-button\r\n\t{background-color:#1a73e8!important}\r\n.primary-button-text\r\n\t{color:#fff!important}\r\n.grey-infobar-text\r\n\t{color:#202124!important}\r\n@media (prefers-color-scheme: dark) {\r\n\r\n\t}\r\n-->\r\n</style><style>\r\n<!--\r\n@media (prefers-color-scheme: dark) {\r\n\r\n\t}\r\n-->\r\n</style><style>\r\n<!--\r\n.prevent-link a\r\n\t{color:inherit!important;\r\n\ttext-decoration:none!important;\r\n\tfont-size:inherit!important;\r\n\tfont-family:inherit!important;\r\n\tfont-weight:inherit!important;\r\n\tline-height:inherit!important}\r\n-->\r\n</style>\r\n</head>\r\n<body class="body">\r\n<span itemscope="" itemtype="http://schema.org/InformAction"><span itemprop="about" itemscope="" itemtype="http://schema.org/Person" style="display:none">\r\n<meta itemprop="description" content="Invitation from Thu Trang Nguyen Thi">\r\n</span><span itemprop="object" itemscope="" itemtype="http://schema.org/Event">\r\n<meta itemprop="eventStatus" content="http://schema.org/EventScheduled">\r\n<span itemprop="publisher" itemscope="" itemtype="http://schema.org/Organization">\r\n<meta itemprop="name" content="Google Calendar">\r\n</span>\r\n<meta itemprop="eventId/googleCalendar" content="21f8e162fd0lbf9f0bdm4a4nvk">\r\n<span itemprop="name" style="display:none; font-size:1px; color:#fff; line-height:1px; height:0; max-height:0; width:0; max-width:0; opacity:0; overflow:hidden">[ITS] MINI SHARING | TON BLOCKCHAIN</span>\r\n<meta itemprop="url" content="https://calendar.google.com/calendar/event?action=VIEW&amp;eid=MjFmOGUxNjJmZDBsYmY5ZjBiZG00YTRudmsgaGlldXB0bUBpY2V0ZWFzb2Z0d2FyZS5jb20&amp;tok=MjMjdHJhbmcubmd1eWVuMUBpY2V0ZWEuaW83MzQ2NzA4YjVkYmI1ZjFiOTJiMDkxMzJhOWQzYmYzOTk2Y2Y1MzRl&amp;ctz=Asia%2FHo_Chi_Minh&amp;hl=en&amp;es=0">\r\n<span aria-hidden="true"><time itemprop="startDate" datetime="20241004T093000Z"></time><time itemprop="endDate" datetime="20241004T103000Z"></time></span>\r\n<div style="display:none; font-size:1px; color:#fff; line-height:1px; height:0; max-height:0; width:0; max-width:0; opacity:0; overflow:hidden">\r\nJoin with Google Meet – Chào mừng anh chị tới buổi sharing&nbsp;TON BLOCKCHAIN&nbsp;của nhà ITS!🗓&nbsp;Thời gian: 4:30 - 5:30, Thứ 6 ngày 4/10/2024📍&nbsp;Địa điểm: phòng Trà Xanh🧑🏻‍💼&nbsp;Speaker:&nbsp;Phạm Trần Minh Hiếu - R&amp;amp;D🎓&nbsp;Đối tượng: Thàn</div>\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center" class="body-container" style="width:100%">\r\n<tbody>\r\n<tr>\r\n<td class="" align="left" style="">\r\n<div aria-hidden="true" style="height:16px">&nbsp; </div>\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center" class="" style="width:100%">\r\n<tbody>\r\n<tr>\r\n<td class="main-container-inner" style="border:solid 1px #dadce0; border-radius:8px; direction:rtl; font-size:0; padding:24px 32px; text-align:left; vertical-align:top">\r\n<div class="column-per-37 outlook-group-fix" style="font-size:13px; text-align:left; direction:ltr; display:inline-block; vertical-align:top; width:100%; overflow:hidden; word-wrap:break-word">\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">\r\n<tbody>\r\n<tr>\r\n<td style="vertical-align:top; padding:0">\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%">\r\n<tbody>\r\n<tr>\r\n<td style="font-size:0; padding:0; text-align:left; word-break:break-word; padding-bottom:28px">\r\n<a href="https://meet.google.com/biq-zqup-gfj?hs=224" class="primary-button-text" style="display:inline-block; font-family:\'Google Sans\',Roboto,sans-serif; font-size:14px; letter-spacing:0.25px; line-height:20px; text-decoration:none; text-transform:none; word-wrap:break-word; white-space:nowrap; color:#fff; font-weight:700; white-space:normal">\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="display:inline-block">\r\n<tbody>\r\n<tr>\r\n<td align="center" role="presentation" valign="middle" class="primary-button" style="background-color:#1a73e8; padding:10px 25px; border:none; border-radius:4px; margin:0">\r\n<span class="primary-button-text" style="font-family:\'Google Sans\',Roboto,sans-serif; font-size:14px; letter-spacing:0.25px; line-height:20px; text-decoration:none; text-transform:none; word-wrap:break-word; white-space:nowrap; color:#fff; font-weight:700; white-space:normal">Join\r\n with Google Meet</span></td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</a></td>\r\n</tr>\r\n<tr>\r\n<td style="font-size:0; padding:0; text-align:left; word-break:break-word; padding-bottom:24px">\r\n<div style="font-family:Roboto,sans-serif; font-size:14px; line-height:20px; text-align:left">\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="padding-bottom:4px">\r\n<tbody>\r\n<tr>\r\n<td>\r\n<h2 class="primary-text" style="font-size:14px; color:#3c4043; text-decoration:none; font-weight:700; margin:0; padding:0">\r\nMeeting link</h2>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<div><a href="https://meet.google.com/biq-zqup-gfj?hs=224" class="secondary-text underline-on-hover" style="display:inline-block; color:#70757a; text-decoration:none">meet.google.com/biq-zqup-gfj</a></div>\r\n</div>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style="font-size:0; padding:0; text-align:left; word-break:break-word; padding-bottom:24px">\r\n<div style="font-family:Roboto,sans-serif; font-size:14px; line-height:20px; text-align:left">\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="padding-bottom:4px">\r\n<tbody>\r\n<tr>\r\n<td>\r\n<h2 class="primary-text" style="font-size:14px; color:#3c4043; text-decoration:none; font-weight:700; margin:0; padding:0">\r\nJoin by phone</h2>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<span class="secondary-text" style="color:#70757a; text-decoration:none">(US) </span>\r\n<a href="tel:+1-323-920-8406%3B929069598%23" class="accent-text underline-on-hover" style="display:inline-block; color:#1a73e8; text-decoration:none">+1 323-920-8406</a>\r\n<br>\r\n<span class="secondary-text" style="color:#70757a; text-decoration:none">PIN: 929069598</span><br>\r\n<br>\r\n<a href="https://tel.meet/biq-zqup-gfj?pin=3582269539557&amp;hs=0" class="accent-text underline-on-hover" style="display:inline-block; color:#1a73e8; text-decoration:none">More phone numbers</a><br>\r\n</div>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</div>\r\n<div class="column-per-63 outlook-group-fix" style="font-size:13px; text-align:left; direction:ltr; display:inline-block; vertical-align:top; width:100%; overflow:hidden; word-wrap:break-word">\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" class="main-column-table-ltr" style="padding-right:32px; padding-left:0; table-layout:fixed">\r\n<tbody>\r\n<tr>\r\n<td class="main-column-td" style="padding:0; vertical-align:top">\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation" width="100%" style="table-layout:fixed">\r\n<tbody>\r\n<tr>\r\n<td style="font-size:0; padding:0; text-align:left; word-break:break-word; padding-bottom:24px">\r\n<div class="primary-text" role="presentation" style="font-family:Roboto,sans-serif; font-style:normal; font-weight:400; font-size:14px; line-height:20px; letter-spacing:0.2px; color:#3c4043; text-decoration:none">\r\n<span><br>\r\nChào mừng anh chị tới buổi sharing&nbsp;<b>TON BLOCKCHAIN</b>&nbsp;của nhà ITS!<br>\r\n<br>\r\n🗓<b>&nbsp;Thời gian</b>: 4:30 - 5:30, Thứ 6 ngày 4/10/2024<br>\r\n📍&nbsp;<b>Địa điểm</b>: phòng Trà Xanh<br>\r\n🧑🏻‍💼&nbsp;<b>Speaker:</b>&nbsp;Phạm Trần Minh Hiếu - R&amp;D<br>\r\n🎓&nbsp;<b>Đối tượng</b>: Thành viên đã đăng ký theo link&nbsp;<br>\r\n📌&nbsp;<b>Thời hạn đăng ký</b>: Trước giờ bắt đầu buổi sharing<br>\r\n<br>\r\n<b>Lưu ý nhỏ</b>: Số lượng người tham gia nhiều nhất là 12 người, mn vui lòng đăng ký sớm để em xếp lịch nhé<br>\r\n<br>\r\nMọi thắc mắc xin vui lòng liên hệ em Trang Nguyễn tại @trangnguyen_LnD để được hỗ trợ nhé ạ!</span>\r\n<meta itemprop="description" content="Chào mừng anh chị tới buổi sharing&nbsp;TON BLOCKCHAIN&nbsp;của nhà ITS!🗓&nbsp;Thời gian: 4:30 - 5:30, Thứ 6 ngày 4/10/2024📍&nbsp;Địa điểm: phòng Trà Xanh🧑🏻‍💼&nbsp;Speaker:&nbsp;Phạm Trần Minh Hiếu - R&amp;amp;D🎓&nbsp;Đối tượng: Thành viên đã đăng ký theo link&nbsp;📌&nbsp;Thời hạn đăng ký: Trước giờ bắt đầu buổi sharingLưu ý nhỏ: Số lượng người tham gia nhiều nhất là 12 người, mn vui lòng đăng ký sớm để em xếp lịch nhéMọi thắc mắc xin vui lòng liên hệ em Trang Nguyễn tại @trangnguyen_LnD để được hỗ trợ nhé ạ!">\r\n</div>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style="font-size:0; padding:0; text-align:left; word-break:break-word; padding-bottom:24px">\r\n<div class="primary-text" role="presentation" style="font-family:Roboto,sans-serif; font-style:normal; font-weight:400; font-size:14px; line-height:20px; letter-spacing:0.2px; color:#3c4043; text-decoration:none">\r\n<span aria-hidden="true"><time itemprop="startDate" datetime="20241004T093000Z"></time><time itemprop="endDate" datetime="20241004T103000Z"></time></span>\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="padding-bottom:4px">\r\n<tbody>\r\n<tr>\r\n<td>\r\n<h2 class="primary-text" style="font-size:14px; color:#3c4043; text-decoration:none; font-weight:700; margin:0; padding:0">\r\nWhen</h2>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<span>Friday Oct 4, 2024 ⋅ 4:30pm – 5:30pm (Indochina Time - Ho Chi Minh City)</span></div>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style="font-size:0; padding:0; text-align:left; word-break:break-word; padding-bottom:24px">\r\n<div class="primary-text" role="presentation" style="font-family:Roboto,sans-serif; font-style:normal; font-weight:400; font-size:14px; line-height:20px; letter-spacing:0.2px; color:#3c4043; text-decoration:none">\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="padding-bottom:4px">\r\n<tbody>\r\n<tr>\r\n<td>\r\n<h2 class="primary-text" style="font-size:14px; color:#3c4043; text-decoration:none; font-weight:700; margin:0; padding:0">\r\nLocation</h2>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<span itemprop="location" itemscope="" itemtype="http://schema.org/Place"><span itemprop="name" class="primary-text notranslate" style="font-family:Roboto,sans-serif; font-style:normal; font-weight:400; font-size:14px; line-height:20px; letter-spacing:0.2px; color:#3c4043; text-decoration:none">IPH-11-Trà\r\n Xanh (8)</span><br>\r\n<a href="https://www.google.com/maps/search/IPH-11-Tr%C3%A0+Xanh+%288%29?hl=en" class="accent-text underline-on-hover" itemprop="map" style="display:inline-block; color:#1a73e8; text-decoration:none; font-weight:700">View map</a></span></div>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style="font-size:0; padding:0; text-align:left; word-break:break-word; padding-bottom:24px">\r\n<div class="primary-text" role="presentation" style="font-family:Roboto,sans-serif; font-style:normal; font-weight:400; font-size:14px; line-height:20px; letter-spacing:0.2px; color:#3c4043; text-decoration:none">\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="padding-bottom:4px">\r\n<tbody>\r\n<tr>\r\n<td>\r\n<h2 class="primary-text" style="font-size:14px; color:#3c4043; text-decoration:none; font-weight:700; margin:0; padding:0">\r\nGuests</h2>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<div style="padding-bottom:4px; text-align:left; color:#3c4042">\r\n<div><span itemprop="attendee" itemscope="" itemtype="http://schema.org/Person"><span itemprop="name" class="notranslate"><a href="mailto:trang.nguyen1@icetea.io" class="primary-text underline-on-hover" style="display:inline-block; color:#3c4043; text-decoration:none">Thu\r\n Trang Nguyen Thi</a></span>\r\n<meta itemprop="email" content="trang.nguyen1@icetea.io">\r\n</span><span itemprop="organizer" itemscope="" itemtype="http://schema.org/Person">\r\n<meta itemprop="name" content="Thu Trang Nguyen Thi">\r\n<meta itemprop="email" content="trang.nguyen1@icetea.io">\r\n</span><span class="secondary-text" style="color:#70757a; text-decoration:none"> - organizer</span></div>\r\n<div><span itemprop="attendee" itemscope="" itemtype="http://schema.org/Person"><span itemprop="name" class="notranslate"><a href="mailto:bich.le@icetea.io" class="primary-text underline-on-hover" style="display:inline-block; color:#3c4043; text-decoration:none">Bich\r\n Le</a></span>\r\n<meta itemprop="email" content="bich.le@icetea.io">\r\n</span><span class="secondary-text" style="color:#70757a; text-decoration:none"></span></div>\r\n<div><span itemprop="attendee" itemscope="" itemtype="http://schema.org/Person"><span itemprop="name" class="notranslate"><a href="mailto:ductv@iceteasoftware.com" class="primary-text underline-on-hover" style="display:inline-block; color:#3c4043; text-decoration:none">ductv@iceteasoftware.com</a></span>\r\n<meta itemprop="email" content="ductv@iceteasoftware.com">\r\n</span><span class="secondary-text" style="color:#70757a; text-decoration:none"></span></div>\r\n<div><span itemprop="attendee" itemscope="" itemtype="http://schema.org/Person"><span itemprop="name" class="notranslate"><a href="mailto:hieuptm@iceteasoftware.com" class="primary-text underline-on-hover" style="display:inline-block; color:#3c4043; text-decoration:none">hieuptm@iceteasoftware.com</a></span>\r\n<meta itemprop="email" content="hieuptm@iceteasoftware.com">\r\n</span><span class="secondary-text" style="color:#70757a; text-decoration:none"></span></div>\r\n<div><span itemprop="attendee" itemscope="" itemtype="http://schema.org/Person"><span itemprop="name" class="notranslate"><a href="mailto:namdk@iceteasoftware.com" class="primary-text underline-on-hover" style="display:inline-block; color:#3c4043; text-decoration:none">namdk@iceteasoftware.com</a></span>\r\n<meta itemprop="email" content="namdk@iceteasoftware.com">\r\n</span><span class="secondary-text" style="color:#70757a; text-decoration:none"></span></div>\r\n<div><span itemprop="attendee" itemscope="" itemtype="http://schema.org/Person"><span itemprop="name" class="notranslate"><a href="mailto:thuttx@iceteasoftware.com" class="primary-text underline-on-hover" style="display:inline-block; color:#3c4043; text-decoration:none">thuttx@iceteasoftware.com</a></span>\r\n<meta itemprop="email" content="thuttx@iceteasoftware.com">\r\n</span><span class="secondary-text" style="color:#70757a; text-decoration:none"></span></div>\r\n<div><span itemprop="attendee" itemscope="" itemtype="http://schema.org/Person"><span itemprop="name" class="notranslate"><a href="mailto:tunk@iceteasoftware.com" class="primary-text underline-on-hover" style="display:inline-block; color:#3c4043; text-decoration:none">tunk@iceteasoftware.com</a></span>\r\n<meta itemprop="email" content="tunk@iceteasoftware.com">\r\n</span><span class="secondary-text" style="color:#70757a; text-decoration:none"></span></div>\r\n<div><span itemprop="attendee" itemscope="" itemtype="http://schema.org/Person"><span itemprop="name" class="notranslate"><a href="mailto:vietnx@iceteasoftware.com" class="primary-text underline-on-hover" style="display:inline-block; color:#3c4043; text-decoration:none">vietnx@iceteasoftware.com</a></span>\r\n<meta itemprop="email" content="vietnx@iceteasoftware.com">\r\n</span><span class="secondary-text" style="color:#70757a; text-decoration:none"></span></div>\r\n</div>\r\n<a href="https://calendar.google.com/calendar/event?action=VIEW&amp;eid=MjFmOGUxNjJmZDBsYmY5ZjBiZG00YTRudmsgaGlldXB0bUBpY2V0ZWFzb2Z0d2FyZS5jb20&amp;tok=MjMjdHJhbmcubmd1eWVuMUBpY2V0ZWEuaW83MzQ2NzA4YjVkYmI1ZjFiOTJiMDkxMzJhOWQzYmYzOTk2Y2Y1MzRl&amp;ctz=Asia%2FHo_Chi_Minh&amp;hl=en&amp;es=0" class="accent-text underline-on-hover" style="display:inline-block; color:#1a73e8; text-decoration:none; font-weight:700">View\r\n all guest info</a></div>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style="font-size:0; padding:0; text-align:left; word-break:break-word; padding-bottom:0px">\r\n<div class="primary-text" style="color:#3c4043; text-decoration:none; font-family:Roboto,sans-serif; font-size:14px; line-height:20px; text-align:left">\r\n<div><span style="font-weight:700">Reply</span><span class="secondary-text" style="color:#70757a; text-decoration:none"> for\r\n<a href="mailto:hieuptm@iceteasoftware.com" class="secondary-text underline-on-hover" style="display:inline-block; color:#70757a; text-decoration:none">\r\nhieuptm@iceteasoftware.com</a></span></div>\r\n</div>\r\n</td>\r\n</tr>\r\n<tr>\r\n<td style="font-size:0; padding:0; text-align:left; word-break:break-word; padding-bottom:16px">\r\n<div style="font-family:Roboto,sans-serif; font-size:14px; line-height:20px; text-align:left">\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border-collapse:separate">\r\n<tbody>\r\n<tr>\r\n<td style="padding-top:8px; padding-left:0; padding-right:12px">\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border:solid 1px #dadce0; border-radius:16px; border-collapse:separate; font-family:\'Google Sans\',Roboto,sans-serif; display:inline-block; margin-right:12px; margin-left:0">\r\n<tbody>\r\n<tr>\r\n<td align="center" role="presentation"><span itemprop="potentialaction" itemscope="" itemtype="http://schema.org/RsvpAction">\r\n<meta itemprop="attendance" content="http://schema.org/RsvpAttendance/Yes">\r\n<span itemprop="handler" itemscope="" itemtype="http://schema.org/HttpActionHandler"><link itemprop="method" href="http://schema.org/HttpRequestMethod/GET"><span style="color:#5f6367"><a href="https://calendar.google.com/calendar/event?action=RESPOND&amp;eid=MjFmOGUxNjJmZDBsYmY5ZjBiZG00YTRudmsgaGlldXB0bUBpY2V0ZWFzb2Z0d2FyZS5jb20&amp;rst=1&amp;tok=MjMjdHJhbmcubmd1eWVuMUBpY2V0ZWEuaW83MzQ2NzA4YjVkYmI1ZjFiOTJiMDkxMzJhOWQzYmYzOTk2Y2Y1MzRl&amp;ctz=Asia%2FHo_Chi_Minh&amp;hl=en&amp;es=0" class="grey-button-text" itemprop="url" style="font-weight:400; font-family:\'Google Sans\',Roboto,sans-serif; color:#5f6368; font-size:14px; line-height:120%; margin:0; text-decoration:none; text-transform:none">\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation">\r\n<tbody>\r\n<tr>\r\n<td align="center" role="presentation" valign="middle" style="padding:6px 0; padding-left:16px; padding-right:12px; white-space:nowrap">\r\n<span class="grey-button-text" style="font-weight:400; font-family:\'Google Sans\',Roboto,sans-serif; color:#5f6368; font-size:14px; line-height:120%; margin:0; text-decoration:none; text-transform:none">Yes</span></td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</a></span></span></span></td>\r\n<td align="center" role="presentation" style="border-left:solid 1px #dadce0; border-right:solid 1px #dadce0">\r\n<span itemprop="potentialaction" itemscope="" itemtype="http://schema.org/RsvpAction">\r\n<meta itemprop="attendance" content="http://schema.org/RsvpAttendance/No">\r\n<span itemprop="handler" itemscope="" itemtype="http://schema.org/HttpActionHandler"><link itemprop="method" href="http://schema.org/HttpRequestMethod/GET"><span style="color:#5f6367"><a href="https://calendar.google.com/calendar/event?action=RESPOND&amp;eid=MjFmOGUxNjJmZDBsYmY5ZjBiZG00YTRudmsgaGlldXB0bUBpY2V0ZWFzb2Z0d2FyZS5jb20&amp;rst=2&amp;tok=MjMjdHJhbmcubmd1eWVuMUBpY2V0ZWEuaW83MzQ2NzA4YjVkYmI1ZjFiOTJiMDkxMzJhOWQzYmYzOTk2Y2Y1MzRl&amp;ctz=Asia%2FHo_Chi_Minh&amp;hl=en&amp;es=0" class="grey-button-text" itemprop="url" style="font-weight:400; font-family:\'Google Sans\',Roboto,sans-serif; color:#5f6368; font-size:14px; line-height:120%; margin:0; text-decoration:none; text-transform:none">\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation">\r\n<tbody>\r\n<tr>\r\n<td align="center" role="presentation" valign="middle" style="padding:6px 12px; white-space:nowrap">\r\n<span class="grey-button-text" style="font-weight:400; font-family:\'Google Sans\',Roboto,sans-serif; color:#5f6368; font-size:14px; line-height:120%; margin:0; text-decoration:none; text-transform:none">No</span></td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</a></span></span></span></td>\r\n<td align="center" role="presentation"><span itemprop="potentialaction" itemscope="" itemtype="http://schema.org/RsvpAction">\r\n<meta itemprop="attendance" content="http://schema.org/RsvpAttendance/Maybe">\r\n<span itemprop="handler" itemscope="" itemtype="http://schema.org/HttpActionHandler"><link itemprop="method" href="http://schema.org/HttpRequestMethod/GET"><span style="color:#5f6367"><a href="https://calendar.google.com/calendar/event?action=RESPOND&amp;eid=MjFmOGUxNjJmZDBsYmY5ZjBiZG00YTRudmsgaGlldXB0bUBpY2V0ZWFzb2Z0d2FyZS5jb20&amp;rst=3&amp;tok=MjMjdHJhbmcubmd1eWVuMUBpY2V0ZWEuaW83MzQ2NzA4YjVkYmI1ZjFiOTJiMDkxMzJhOWQzYmYzOTk2Y2Y1MzRl&amp;ctz=Asia%2FHo_Chi_Minh&amp;hl=en&amp;es=0" class="grey-button-text" itemprop="url" style="font-weight:400; font-family:\'Google Sans\',Roboto,sans-serif; color:#5f6368; font-size:14px; line-height:120%; margin:0; text-decoration:none; text-transform:none">\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation">\r\n<tbody>\r\n<tr>\r\n<td align="center" role="presentation" valign="middle" style="padding:6px 0; padding-left:12px; padding-right:16px; white-space:nowrap">\r\n<span class="grey-button-text" style="font-weight:400; font-family:\'Google Sans\',Roboto,sans-serif; color:#5f6368; font-size:14px; line-height:120%; margin:0; text-decoration:none; text-transform:none">Maybe</span></td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</a></span></span></span></td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<a href="https://calendar.google.com/calendar/event?action=VIEW&amp;eid=MjFmOGUxNjJmZDBsYmY5ZjBiZG00YTRudmsgaGlldXB0bUBpY2V0ZWFzb2Z0d2FyZS5jb20&amp;tok=MjMjdHJhbmcubmd1eWVuMUBpY2V0ZWEuaW83MzQ2NzA4YjVkYmI1ZjFiOTJiMDkxMzJhOWQzYmYzOTk2Y2Y1MzRl&amp;ctz=Asia%2FHo_Chi_Minh&amp;hl=en&amp;es=0" class="grey-button-text" style="display:inline-block; font-weight:400; font-family:\'Google Sans\',Roboto,sans-serif; color:#5f6368; font-size:14px; line-height:120%; margin:0; text-decoration:none; text-transform:none">\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="border:solid 1px #dadce0; border-radius:16px; border-collapse:separate; font-family:\'Google Sans\',Roboto,sans-serif">\r\n<tbody>\r\n<tr>\r\n<td align="center" role="presentation" style="padding:6px 0; padding-left:16px; padding-right:12px; white-space:nowrap; color:#5f6367">\r\n<span class="grey-button-text" style="font-weight:400; font-family:\'Google Sans\',Roboto,sans-serif; color:#5f6368; font-size:14px; line-height:120%; margin:0; text-decoration:none; text-transform:none">More options</span></td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</a></td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</div>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</div>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n<table border="0" cellpadding="0" cellspacing="0" role="presentation" align="center" class="" style="width:100%">\r\n<tbody>\r\n<tr>\r\n<td class="" align="left" style="font-size:0; padding:0; text-align:left; word-break:break-word; padding:4px 12px">\r\n<div class="secondary-text" style="color:#70757a; text-decoration:none; font-family:Roboto,sans-serif; font-size:12px; line-height:16px; text-align:left">\r\n<p>Invitation from <a href="https://calendar.google.com/calendar/" class="accent-text underline-on-hover" style="font-family:Roboto,sans-serif; font-size:12px; line-height:16px; color:#1a73e8; text-decoration:none">\r\nGoogle Calendar</a></p>\r\n<p>You are receiving this email because you are an attendee on the event. To stop receiving future updates for this event, decline this event.</p>\r\n<p>Forwarding this invitation could allow any recipient to send a response to the organizer, be added to the guest list, invite others regardless of their own invitation status, or modify your RSVP.\r\n<a href="https://support.google.com/calendar/answer/37135#forwarding" class="accent-text underline-on-hover" style="font-family:Roboto,sans-serif; font-size:12px; line-height:16px; color:#1a73e8; text-decoration:none">\r\nLearn more</a></p>\r\n</div>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</td>\r\n</tr>\r\n</tbody>\r\n</table>\r\n</span></span>\r\n</body>\r\n</html>\r\n'
        },
        location: {
          // attendees
          uniqueId: 'hud.17.hoptac@iceteasoftware.com'
        },
        attendees: [
          // attendees
          {
            emailAddress: {
              address: 'hud.17.hoptac@iceteasoftware.com'
            }
          }
          // {
          //   emailAddress: {
          //     address: 'vietnx@iceteasoftware.com'
          //   }
          // }
        ],
        organizer: {
          // organizer
          emailAddress: {
            address: 'hieuptm@iceteasoftware.com'
          }
        }
      },
      (err, res) => {
        if (err) {
          console.log(err)
          return
        }
        const e: Event = res.value
        console.log('TestService2 ~ onModuleInit1 ~ e:', e)
      }
    )

    return 123
  }

  @Post('microsoft')
  async index2(
    @Body() body: ChangeNotificationCollection,
    @Query() query: any,
    @Res() res: Response
  ) {
    // console.log('Webhook ~ index2 ~ body:', body?.value)
    console.log('Webhook ~ time:', this.time, new Date())
    const t = this.time
    this.time++

    // Create msal application object
    const msalClient = new ConfidentialClientApplication({
      auth: {
        clientId: process.env.OAUTH_CLIENT_ID || '',
        authority: `${process.env.OAUTH_AUTHORITY}/${process.env.OAUTH_TENANT_ID}`,
        clientSecret: process.env.OAUTH_CLIENT_SECRET
      },
      system: {
        loggerOptions: {
          loggerCallback(logLevel, message, containsPii) {
            console.log(message)
          },
          piiLoggingEnabled: false,
          logLevel: LogLevel.Error
        }
      }
    })
    const client = Client.init({
      // Implement an auth provider that gets a token
      // from the app's MSAL instance
      authProvider: async (done) => {
        try {
          // Get a token using client credentials
          const response = await msalClient.acquireTokenByClientCredential({
            scopes: [
              'https://graph.microsoft.com/.default'
              // 'https://graph.microsoft.com/User.Read.All'
            ]
          })
          if (!response) return done(new Error('Error: No response'), null)
          // First param to callback is the error,
          // Set to null in success case
          done(null, response.accessToken)
        } catch (err) {
          console.log(JSON.stringify(err, Object.getOwnPropertyNames(err)))
          done(err, null)
        }
      }
    })

    if (query && query.validationToken) {
      res.setHeader('Content-Type', 'text/plain')
      res.status(201).send(query.validationToken)
      return
    }

    const JWKS = createRemoteJWKSet(
      new URL('https://login.microsoftonline.com/common/discovery/v2.0/keys')
    )

    // Check for validation tokens, validate them if present
    let areTokensValid = true

    if (body.validationTokens) {
      console.log('Webhook ~ body.validationTokens:', body.validationTokens)
      const appId = process.env.OAUTH_CLIENT_ID!
      const tenantId = process.env.OAUTH_TENANT_ID

      const { payload, protectedHeader } = await jwtVerify(
        body.validationTokens[0],
        JWKS,
        {
          audience: [appId],
          issuer: [`https://sts.windows.net/${tenantId}/`]
        }
      )
      console.log('Webhook ~ payload:', payload)
      console.log('Webhook ~ protectedHeader:', protectedHeader)

      // const validationResults = await Promise.all(
      //   body.validationTokens.map((token) =>
      //     tokenHelper.isTokenValid(token, appId, tenantId)
      //   )
      // )

      // areTokensValid = validationResults.reduce((x, y) => x && y)
    }

    if (!body.value) {
      res.status(202).end()
      return
    }
    for (let i = 0; i < body.value.length; i++) {
      const notification = body.value[i]

      // // Verify we have a matching subscription record in the database
      // const subscription = await dbHelper.getSubscription(
      //   notification.subscriptionId
      // )
      // if (subscription) {
      //   // If notification has encrypted content, process that
      //   if (notification.encryptedContent) {
      //     processEncryptedNotification(notification)
      //   } else {
      //     await processNotification(
      //       notification,
      //       req.app.locals.msalClient,
      //       subscription.userAccountId
      //     )
      //   }
      // }

      //////////////////////
      console.log('Webhook ~ notification:', t, notification.changeType)
      client
        .api(
          `/users/hieuptm@iceteasoftware.com/events/${notification.resourceData?.['id']}?$select=subject,organizer,attendees,start,end,location`
        )
        .get((err, res) => {
          if (err) {
            console.log(123, err)
            return
          }
          console.log(t, res.subject, res.status, res.attendees)
          // const events: Event[] = res.value
          // console.log(events)
        })
        .catch((err) => {
          console.log(456, err)
        })
    }

    res.status(202).end()
  }

  @Post('microsoft/lifecycle')
  async index3(@Query() query: any, @Res() res: Response) {
    if (query && query.validationToken) {
      res.setHeader('Content-Type', 'text/plain')
      res.status(201).send(query.validationToken)
      return
    }
  }
}
