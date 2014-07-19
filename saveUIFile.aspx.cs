using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.IO;
using System.Text.RegularExpressions;

namespace UI
{
    public partial class saveUIFile : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string json = "";    
            try {


                if (Request.QueryString.Count > 0) { 
                    string filename = Request.QueryString["filename"];
                    string uiFileContent = File.ReadAllText(Server.MapPath("/") + filename);

                    string newFileContent = uiFileContent;
                    foreach (String key in Request.QueryString.AllKeys)
                    {
                        newFileContent = Regex.Replace(newFileContent, "(?<val>\"" + key + "\"\\s*:\\s*)(\\d+)", "${val}" + Request.QueryString[key]);
                        

                    }
                    if (newFileContent.Equals(uiFileContent))
                    {
                        json = "{\"code\":1, \"success\":\"No Changes made to " + filename + "!\"}";
                    }
                    else
                    {
                        json = "{\"code\":0, \"success\":\"Saved changes to " + filename + "\"}";
                        File.WriteAllText(Server.MapPath("/") + filename, newFileContent);
                    }
                    
                }
                else
                {
                    json = "{\"code\":53, \"error\":\"No GET Parameter\"}";
                }
               

            } catch(Exception ex) {
                json = "{\"error\":\""+ex.Message+"\"}";
            }
            Response.Clear();
            Response.ContentType = "application/json; charset=utf-8";
            Response.Write(json);
            Response.End();
        }

    }
}