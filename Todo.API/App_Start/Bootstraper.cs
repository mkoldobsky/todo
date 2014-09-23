using System;
using System.Collections.Generic;
using System.ComponentModel.Design;
using System.Linq;
using System.Reflection;
using System.Web;
using System.Web.Http;
using Autofac;
using Autofac.Integration.WebApi;
using Todo.API.Mappers;
using Todo.Data;
using Todo.Data.Infrastructure;
using Todo.Data.Repositories;
using Todo.Model.Models;
using Todo.Services;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;

namespace Todo.API.App_Start
{
    public static class Bootstrapper
    {
        public static void Configure(HttpConfiguration config)
        {
            
            ConfigureAutofacContainer(config);
            AutoMapperConfiguration.Configure();
           
        }

        public static void ConfigureAutofacContainer(HttpConfiguration config)
        {

            var webApiContainerBuilder = new ContainerBuilder();
            ConfigureWebApiContainer(webApiContainerBuilder, config);
        }

        public static void ConfigureWebApiContainer(ContainerBuilder containerBuilder, HttpConfiguration config)
        {
            containerBuilder.RegisterType<DatabaseFactory>().As<IDatabaseFactory>().AsImplementedInterfaces().InstancePerRequest();
            containerBuilder.RegisterType<UnitOfWork>().As<IUnitOfWork>().AsImplementedInterfaces().InstancePerRequest();
            containerBuilder.RegisterType<UserRepository>().As<IUserRepository>().InstancePerRequest();
            containerBuilder.RegisterType<UserService>().As<IUserService>().InstancePerRequest();
            containerBuilder.RegisterType<TodoService>().As<ITodoService>().InstancePerRequest();
            containerBuilder.RegisterType<UserStore<ApplicationUser>>().As<IUserStore<ApplicationUser>>().InstancePerRequest();
            containerBuilder.RegisterType<RoleStore<IdentityRole>>().As<IRoleStore<IdentityRole, string>>().InstancePerRequest();
            containerBuilder.RegisterType<TodoRepository>().As<ITodoRepository>().InstancePerRequest();


            containerBuilder.Register(c => new UserManager<ApplicationUser>(new UserStore<ApplicationUser>(new UserContext())
            {
                /*Avoids UserStore invoking SaveChanges on every actions.*/
                //AutoSaveChanges = false
            })).As<UserManager<ApplicationUser>>().InstancePerRequest();

            containerBuilder.RegisterApiControllers(Assembly.GetExecutingAssembly());

            IContainer container = containerBuilder.Build();
            config.DependencyResolver = new AutofacWebApiDependencyResolver(container);


        }

    }
}