/// <reference path="../vendor/jquery.d.ts" />
/// <reference path="../vendor/jqueryui.d.ts" />
/// <reference path="../cu/cu.ts" />

var cu = new CU();
var UI = UI || {};
class UILoader {
    private $clientWindow: JQuery = $("#clientWindow");
    private $uiList: JQuery = $("#ui-list");
    private $saveBtn: JQuery = $('#save');
    private $reloadBtn: JQuery = $('#reload');
    private $saveModuleList: JQuery = $('#saveModuleList');

    constructor() {
        this.$saveBtn.button({ 'icons': { 'primary': 'ui-icon-disk' } }).on('click', () => {
            var $uiList: JQuery = $(".ui-frame");
            var requests: Array<any> = [];
            var messages: Array<string> = [];
            $uiList.each((index, element) => {
                
                var name: string = $(element).attr('data-name');
                var filename: string = name + ".ui";
                var position: any = $(element).position();
                var top: number = position.top;
                var left: number = position.left;
                var bottom: number = top + $(element).height();
                var right: number = left + $(element).width();
                var uiFileContentParam: string = jQuery.param({
                    'name': name,
                    'filename': filename,
                    'top': top,
                    'left': left,
                    'bottom': bottom,
                    'right': right
                    
                });
                var request = $.ajax({
                    url: '/saveUIFile.aspx',
                    data: uiFileContentParam
                });
                requests.push(request);
                request.done((json) => {
                    if (json) {
                        switch (json.code) {
                            case 0:
                            case 1:
                                messages.push(json.success);
                                break;
                            case 53:
                                messages.push(json.error);
                                break;
                            default:
                                messages.push("Unknown Errorcode on "+filename);
                                break;
                        }
                    }
                    else {
                        messages.push("Something bad happend with " + filename)
                    }
                });
                
            });
            $.when.apply($, requests).then(function (schemas) {
                console.log("DONE", messages);
                alert(messages.join("\n"));
                
            }, function (e) {
                alert("Something went wrong! Check your console");
            });
        });
        this.$saveModuleList.button({ 'icons': { 'primary': 'ui-icon-arrowrefresh-1-n' } }).on('click', () => {
            var $uiList: JQuery = $(".ui-frame");
            var uiFileContentParams: Array<String> = [];

            $uiList.each((index, element) => {
                var name: string = $(element).attr('data-name');
                var autoload: boolean = $(element).children(".ui-icon-minus").length !== 0;
                var uiFileContentParam: string = jQuery.param({
                    'name': name,
                    'autoload': autoload
                });
                uiFileContentParams.push(uiFileContentParam);
            });
            var request = $.ajax({
                url: '/saveModuleList.aspx',
                data: uiFileContentParams.join("&")
            });

            request
                .done((json) => {
                    console.log(json);
                    if (json && json.code === 0) {
                        alert(json.success);
                    }
                })
                .fail((jqXHR, textStatus, errorThrown) => {
                    console.error(errorThrown);
                })            
        });
        this.$reloadBtn.button({ 'icons': { 'primary': 'ui-icon-disk' } }).on('click', () => {
            this.$clientWindow.empty();
            this.parseUIList(this.$uiList);
        });
        if (this.$uiList.children().length === 0) {
            console.log("Loading UI Elements from file system");
            this.$uiList.load('/getUIFiles.aspx #ui-list li', () => {
                this.parseUIList(this.$uiList);
            });
        }
        else {
            console.log("Loading UI Elements from index.html");
            this.parseUIList(this.$uiList);
        }



    }

    private parseUIList(uiList: JQuery): void {
        uiList.children().each((index, element) => {
            var uiFilename: string = $(element).text();
            
            var json: any = $.getJSON('/' + uiFilename)
            json.done((json) => {
                console.log('Loading "' + uiFilename + '"...', json);
                
                this.LoadUI(json);
            })
            .fail((jqXHR, textStatus, errorThrown) => {
                console.error(errorThrown);
            })
        });
    }
    private LoadUI(m: UIModel): void {
        if (m.onload === false) {
            console.log('Skipping "' + m.name + '" because of "onload" is set to false');
            return;
        }
        var name: string = m.name;
        var coords: UIModelCoords = m.rect;
        var htmlFile: string = m.mainFile;
        var top: number = coords.top;
        var left: number = coords.left;
        var height: number = coords.bottom - coords.top;
        var width: number = coords.right - coords.left;
        var autoload: boolean = UI.Modules && UI.Modules[name] && UI.Modules[name].autoload;
        var core: boolean = UI.Modules && UI.Modules[name] && UI.Modules[name].core;
        
        $('<div/>')
            .addClass('ui-frame').css({
                top: top,
                left: left,
                height: height,
                width: width
            })
            .attr("data-name", name)
            .attr("data-autoload", autoload ? "true" : "false") // TODO: Load this from module-list.js ..whaait
            .append(
            $('<span class="ui-icon ui-icon-arrow-4" title="Move UI"></span>')
            )
            .append(
            $('<span class="ui-icon' + (core ? "hide" : (autoload ? " ui-icon-minus" : " ui-icon-plus")) + '" title="Autoload UI"></span>')
                .on("click", (event) => {
                    $(event.target).toggleClass("ui-icon-minus ui-icon-plus");
                })
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
                'iframeFix': true,
                handle: ".ui-icon-arrow-4"

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
    onload?: boolean;
}
interface UIModelCoords {
    top: number;
    bottom: number;
    left: number;
    right: number;
}
var loader = new UILoader();