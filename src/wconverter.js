import remark from 'remark'
import remarkHmtl from 'remark-html'
import toMarkdown from 'to-markdown'


let listNumber
let checkNumber = 0
let tableWidth
let span
let translatedLine
let links

export default class {

  static decode (lineElement, mode) {
    let temp   = lineElement.text()
    let params = temp.split(' ')

    switch (params[0]) {
      case '#':
        let text = temp.slice(1)
        translatedLine = $('<h1></h1>')
        translatedLine.append(text)
        lineElement.html(translatedLine)
        lineElement.addClass('note-title')
        $('.doc-title').eq(0).text(text)

        break

      case '[]':
        {
          let text = temp.slice(2)
          let fileresult = remark().use(remarkHmtl).processSync([text].join('\n')) 
          temp = `<input type='checkbox' id='check-${checkNumber}' class='filled-in'/>`
          temp += String(fileresult).trim()
          lineElement.html(temp)
          lineElement.addClass('linea-lista')
          checkNumber++
        }
        break
      case '[x]':
        {
          let text = temp.slice(3)
          let fileresult = remark().use(remarkHmtl).processSync([text].join('\n')) 
          temp = `<input type='checkbox' id='check-${checkNumber}' class='filled-in' checked/>`
          temp += String(fileresult).trim()
          lineElement.html(temp)
          lineElement.addClass('linea-lista')
          lib.externalLinks() 
          checkNumber++
        }
        break

      case 'hc':
        {
          temp = $('<h2></h2>')
          temp.css({
            'color': params[1]
          })
          for (let i = 2;  i < params.length;  i++) {
            temp.append(params[i] + ' ')
          }
          lineElement.html(temp)
          lineElement.addClass('apuntes-title')
        }
        break
        // 7 - tags decoder (one of mi favorites xD)
      case 'tags':
        {
          temp = ''
          for (let i = 1; i < params.length;  i++) {
            temp += ("<span class='icon icon-tag tag'> " + params[i] + ' </span>')
          }
          lineElement.html(temp)
          lineElement.addClass('tags-container')
        }
        break
        // 8 - tables Header decoder
      case '||':
        {
          temp = temp.slice(2)
          params = temp.split('|')
          temp = $('<table></table>').addClass('apuntes-table')
          for (let i = 0 ; i < params.length;  i++) {
            temp.append('<th>' + params[i].trim() + '</th>')
          }
          tableWidth = 100 / params.length
          temp.children().css({
            'width': tableWidth + '%'
          })
          lineElement.html(temp)
        }
        break
        // 8.1- Tables decoder
      case '|':
        {
          temp = temp.slice(1)
          params = temp.split('|')
          temp = $('<table></table>').addClass('apuntes-table body')
          for (let i = 0;  i < params.length;  i++) {
            temp.append('<td>' + params[i].trim() + ' </td>')
          }
          temp.children().css({
            'width': tableWidth + '%'
          })
          lineElement.html(temp)
        }
        break

        // default is a markdownsupport

      default:
        let fileresult = remark().use(remarkHmtl).processSync([temp].join('\n'))
        lineElement.html(String(fileresult).trim())
        lib.externalLinks() 
        break
    } // end of switch

  }

  static encode(lineElement) {
    let temp = lineElement.html()
    let endTag = temp.indexOf(">")
    let tag = temp.slice(0, endTag + 1)
    let text = "",
      th,
      result,
      checkbox

    if (tag.includes('type="checkbox"')) {
      checkbox = "[] " 
      if (tag.includes('checked')) {
        checkbox = "[x] " 
      }
      text = lineElement.find('p').html() 
      result = checkbox + toMarkdown(text, {
        gmf: true
      })

    } else if (tag.includes("<table")) {
      if (temp.includes("<th")) {
        th = lineElement.find("th")
        result = "|"
      } else {
        th = lineElement.find("td")
        result = ""
      }

      th.each(function (i, el) {
        result += "| " + $(this).text() + " "
      })

    } else if (tag.includes('<span class="icon icon-tag tag">')) {

    } else if (temp.includes('start=')) {
      let ol = lineElement.find("ol")
      result = ol.attr("start")
      result += ". " + toMarkdown(ol.find('li').html(), {
        gmf: true
      })
    } else {
      result = toMarkdown(temp, {
        gfm: true
      })
    }

    lineElement.empty() 
    lineElement.focus()
    lineElement.text(result) 
    lineElement.attr("contenteditable", "true")
  }

}