using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.IO;

namespace UI
{
    public partial class getUIFiles : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            HtmlGenericControl uiList = new HtmlGenericControl("ul"); 
            uiList.Attributes.Add("id","ui-list");
            uiList.Attributes.Add("class", "hide");
            DirectoryInfo di = new DirectoryInfo(Server.MapPath("/"));
            FileInfo[] uiFiles = di.GetFiles("*.ui");
            foreach(FileInfo uiFile in uiFiles) {
                HtmlGenericControl uiListLi = new HtmlGenericControl("li"); 
                uiListLi.InnerText = uiFile.Name;
                uiList.Controls.Add(uiListLi);
            }
            uiListContainer.Controls.Add(uiList);
        }
    }
}