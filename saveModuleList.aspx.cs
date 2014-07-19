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
    public partial class saveModuleList : System.Web.UI.Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            string json = "";
            try
            {

                
                if (Request.QueryString.Count > 0)
                {
                    string filename = Server.MapPath("/") + "module-list.js";
                    string moduleListContent = "var UI = UI || {};\nUI.Modules = {\n<!--ModuleList-->\n};";
                    string[] coreModules = { "character", "chat", "errormessages", "gamemenu", "kills", "login", "login", "perfhud", "respawn", "skillbar", "target" };
                    string[] moduleNames = Request.QueryString["name"].Split(',');
                    string[] autoLoadModules = Request.QueryString["autoload"].Split(',');
                    string moduleString = "";
                    string delimiter = "";

                    if (File.Exists(filename))
                    {
                        json = "{\"code\":0, \"success\":\"module-list.js successfully updated\"}";
                    }
                    else
                    {
                        json = "{\"code\":0, \"success\":\"module-list.js successfully created\"}";
                    }

                    for (var i = 0; i < moduleNames.Length; i++)
                    {
                        string module = "\t" + delimiter + "\"" + moduleNames[i] + "\": {";
                        if (coreModules.Contains(moduleNames[i]))
                        {
                            module += "\"core\" : true";
                        }
                        else
                        {
                            module += "\"core\" : false, \"autoload\" : " + autoLoadModules[i];
                        }

                        module += "}\n";
                        delimiter = ",";
                        moduleString += module;
                    }
                    moduleListContent = moduleListContent.Replace("<!--ModuleList-->", moduleString);
                    File.WriteAllText(filename, moduleListContent);


                }
                else
                {
                    json = "{\"code\":53, \"error\":\"No GET Parameter\"}";
                }
                 

            }
            catch (Exception ex)
            {
                json = "{\"error\":\"" + ex.Message + "\"}";
            }
            Response.Clear();
            Response.ContentType = "application/json; charset=utf-8";
            Response.Write(json);
            Response.End();
        }
    }
}