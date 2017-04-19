//  here we convert the markdown,the text or jchunk in the line in new html
//  aquin convertimos el codigo markdown, jchunk o texto en nuevo html
const remark = require('remark')
const remarkHmtl = require('remark-html')
const highlight = require('highlight.js')


var listNumber
var checkNumber = 0
var tableWidth
var span
var translatedLine
var links

exports.decode = function (lineElement) {
    var temp = lineElement.text()
    var params = temp.split(' ')

    switch (params[0]) {
     // J-shunks support                                                                                                                     
      case 't':
        var text = temp.slice(1)

        span = $('<span></span>').addClass('icon icon-link')
        translatedLine = $('<h1></h1>').html(span)
        translatedLine.append(text)
        lineElement.html(translatedLine)
        lineElement.addClass('note-title')
        $('.doc-title').eq(0).text(text)

        break
                                                                                                                         
      case 'c': {
        var text = temp.slice(2)
        temp = `<input type='checkbox' id='check-${checkNumber}' class='filled-in'/> <label for='check-${checkNumber}'>` + text + '</label>'
        lineElement.html(temp)
        lineElement.addClass('linea-lista')
        checkNumber++
      }
        break
                                                                                                                                
      case 'hc': {
        temp = $('<h3></h3>')
        temp.css({'color': params[1]})
        console.log(params[0] + ' ' + params[1] + ' ' + params[2])
        for (var i = 2; i < params.length; i++) {
          temp.append(params[i] + ' ')
        }
        lineElement.html(temp)
        lineElement.addClass('apuntes-title')
      }
        break
                                                                                                                                  // 7 - tags decoder (one of mi favorites xD)
      case 'tags': {
        temp = ''
        for (var i = 1; i < params.length; i++) {
          temp += ("<span class='icon icon-tag tag'> " + params[i] + ' </span>')
        }
        lineElement.html(temp)
        lineElement.addClass('tags-container')
      }
        break
                                                                                                                                  // 8 - tables Header decoder
      case '||': {
        temp = temp.slice(2)
        params = temp.split('|')
        temp = $('<table></table>').addClass('apuntes-table')
        for (var i = 0; i < params.length; i++) {
          temp.append('<th>' + params[i].trim() + '</th>')
        }
        tableWidth = 100 / params.length
        temp.children().css({'width': tableWidth + '%'})
        lineElement.html(temp)
      }
        break
                                                                                                                                    // 8.1- Tables decoder
      case '|': {
        temp = temp.slice(1)
        params = temp.split('|')
        temp = $('<table></table>').addClass('apuntes-table body')
        for (var i = 0; i < params.length; i++) {
          temp.append('<td>' + params[i].trim() + ' </td>')
        }
        temp.children().css({'width': tableWidth + '%'})
        console.log(temp.children())
        lineElement.html(temp)
      }
        break

     // default is a markdownsupport

      default:
        var fileresult = remark().use(remarkHmtl).processSync([temp].join('\n'))
        lineElement.html(String(fileresult).trim())

        $('code').each(function (i, block) {
          highlight.highlightBlock(block)
        })
        break
    } // end of switch
  }



