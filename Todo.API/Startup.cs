using System.Web.Http;
using Todo.API.App_Start;
using Owin;
using Microsoft.Owin;
using Microsoft.Owin.Cors;

[assembly: OwinStartup(typeof(Todo.API.Startup))]

namespace Todo.API
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            var config = new HttpConfiguration();
            WebApiConfig.Register(config);
            app.UseCors(CorsOptions.AllowAll);
            Bootstrapper.Configure(config);
            ConfigureAuth(app);
            app.UseWebApi(config);
        }
    }
}