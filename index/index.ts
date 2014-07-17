/// <reference path="../vendor/jquery.d.ts" />
/// <reference path="../vendor/jqueryui.d.ts" />
/// <reference path="../cu/cu.ts" />

var cu = new CU();

class UILoader {
    private $clientWindow: JQuery = $("#clientWindow");
    private $uiList: JQuery = $("#ui-list").children();

    constructor() {
        console.log("Loading UI Elements")

        this.$uiList.each((index, element) => {
            var uiFilename: string = $(element).text();
            console.log('Loading "' + uiFilename + '"...');
            var json: any = $.getJSON('/' + uiFilename)
            json
                .done((json) => {
                    console.log(json);
                    this.LoadUI(json);
                 })
                .fail((jqXHR, textStatus, errorThrown) => {
                    console.error(errorThrown);
                })
        });
    }


    private LoadUI(m: UIModel): void {
        var name: string = m.name;
        var coords: UIModelCoords = m.rect;
        var htmlFile: string = m.mainFile;
        var top: number = coords.top;
        var left: number = coords.left;
        var height: number = coords.bottom - coords.top;
        var width: number = coords.right - coords.left;

        $('<div/>').addClass('ui-frame ui-' + name).css({
            top: top,
            left: left,
            height: height,
            width: width,
            backgroundColor: "rgba(255,255,255,.5)"
        })
        .append(
            $('<span class="ui-icon ui-icon-arrow-4"></span>')
        )
        .append(
            $('<iframe />')
                .attr("width", width)
                .attr("height", height)
                .attr("scrolling", "false")
                .attr("src", htmlFile)
        )
        .appendTo(this.$clientWindow)
        .draggable({
            'containment': 'parent',
            'iframeFix': 'iframe'
        })
        
    }

}
/*
    This .ui files have more information than the interfaces shows. But those are the attributes we need
*/
interface UIModel {

    mainFile: string;
    name: string;
    rect: UIModelCoords;
}
interface UIModelCoords {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
var loader = new UILoader();