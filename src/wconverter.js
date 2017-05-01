//  here we convert the markdown,the text or jchunk in the line in new html
//  aquin convertimos el codigo markdown, jchunk o texto en nuevo html
const remark = require('remark')
const remarkHmtl = require('remark-html')
const toMarkdown = require('to-markdown')


var listNumber
var checkNumber = 0
var tableWidth
var span
var translatedLine
var links


/**
 * Recieves the line and Converts the markdown into html
 * @param {jqueryElement} lineElement
 * @return {void}
 */  

exports.decode = function (lineElement) {
    var temp = lineElement.text()
    var params = temp.split(' ')
    
    switch (params[0]) {
     // J-shunks support                                                                                                                     
      case '#':
        var text = temp.slice(1)

        translatedLine = $('<h1></h1>')
        translatedLine.append(text)
        lineElement.html(translatedLine)
        lineElement.addClass('note-title')
        $('.doc-title').eq(0).text(text)

        break
                                                                                                                         
      case '[]': {
        var text = temp.slice(2)
        temp = `<input type='checkbox' id='check-${checkNumber}' class='filled-in'/> <label for='check-${checkNumber}'>` + text + '</label>'
        lineElement.html(temp)
        lineElement.addClass('linea-lista')
        checkNumber++
      }
        break
      case '[x]': {
        var text = temp.slice(3)
        temp = `<input type='checkbox' id='check-${checkNumber}' class='filled-in' checked='true'/> <label for='check-${checkNumber}'>` + text + '</label>'
        lineElement.html(temp)
        lineElement.addClass('linea-lista')
        checkNumber++
      }
        break
                                                                                                                                
      case 'hc': {
        temp = $('<h2></h2>')
        temp.css({'color': params[1]})
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
        lineElement.html(temp)
      }
        break

     // default is a markdownsupport

      default:
        var fileresult = remark().use(remarkHmtl).processSync([temp].join('\n'))
        lineElement.html(String(fileresult).trim())
        lib.externalLinks();      
        break
    } // end of switch

  }

  exports.encode = function (lineElement) {
    var temp = lineElement.html()
    var endTag = temp.indexOf(">") 
    var tag = temp.slice(0,endTag + 1)
    var text = "",
        th,
        result
    
    if(tag.includes('type="checkbox"')){
      if(tag.includes('checked="true"')){
        text = lineElement.find("label").text();
        lineElement.text("[x] " + text)
      }else{
        text = lineElement.find("label").text();
        lineElement.text("[] " + text)
      }

    }
    else if(tag.includes("<table")){
      if(temp.includes("<th")){
        th = lineElement.find("th")
        result = "|"
      }else{
        th = lineElement.find("td")
        result = ""
      }

      th.each(function(i,el){
        result += "| " + $(this).text() + " "
      })

      lineElement.text(result)

    }
    else if(tag.includes('<span class="icon icon-tag tag">')){

    }
    else if(temp.includes('=hljs')){

    }
    else{
      s = toMarkdown(temp)
      lineElement.text(s)
    }

  }



