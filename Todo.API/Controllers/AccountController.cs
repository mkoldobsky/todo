using System;
using System.Linq;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;
using System.Web.UI.WebControls;
using AutoMapper;
using Todo.API.ViewModels;
using Todo.Data.Infrastructure;
using Todo.Model.Models;
using Todo.Services;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.Owin.Security;
using Todo.Data;
using System.Collections.Generic;

namespace Todo.API.Controllers
{
    [RoutePrefix("account")]
    public class AccountController : ApiController
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IUserService _service;

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.Current.GetOwinContext().Authentication;
            }
        }

        public AccountController(IUserService userService, UserManager<ApplicationUser> userManager) 
        {
            _service = userService;
            _userManager = userManager;
        }


   }
}