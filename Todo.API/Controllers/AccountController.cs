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
        private readonly ICircuitService _circuitService;

        private IAuthenticationManager AuthenticationManager
        {
            get
            {
                return HttpContext.Current.GetOwinContext().Authentication;
            }
        }

        public AccountController(IUserService userService, UserManager<ApplicationUser> userManager, ICircuitService circuitService) //IUserStore<ApplicationUser> userStore, IRoleStore<IdentityRole, string> roleStore)
        {
            _service = userService;
            _userManager = userManager;
            _circuitService = circuitService;
        }


        [Route("")]
        [Authorize]
        public IHttpActionResult Get()
        {
            var users = _service.GetAll();

            var usersViewModel = new List<UserViewModel>();
            Mapper.Map(users, usersViewModel);
            return Ok(usersViewModel);
        }

        [Authorize]
        [Route("roles/{id}")]
        [HttpGet]
        public IHttpActionResult GetRoles(string id)
        {
            var roles = _userManager.GetRolesAsync(id);
            return Ok(roles);
        }

        [Authorize]
        [Route("")]
        [HttpPost]
        public async Task<IHttpActionResult> Post(RegisterViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var exists = _service.GetUserByDocument((DocumentType)viewModel.documentTypeId, viewModel.documentNumber);
                    if (exists != null)
                        return BadRequest("Documento existente");
                    var user = new ApplicationUser
                    {
                        Active = viewModel.active,
                        UserName = viewModel.username,
                        Email = viewModel.email,
                        Names = viewModel.names,
                        FatherLastName = viewModel.fatherLastName,
                        MotherLastName = viewModel.motherLastName,
                        DocumentType = (DocumentType)viewModel.documentTypeId,
                        DocumentNumber = viewModel.documentNumber,
                        ShouldChangePassword = viewModel.shouldChangePassword

                    };


                    var identityResult = await _userManager.CreateAsync(user, viewModel.password);

                    if (identityResult.Succeeded)
                    {

                        if (viewModel.adminCompany)
                            await _userManager.AddToRoleAsync(user.Id, "AdministrativoEmpresas");
                        if (viewModel.adminProtocols)
                            await _userManager.AddToRoleAsync(user.Id, "AdministrativoProtocolos");
                        if (viewModel.config)
                            await _userManager.AddToRoleAsync(user.Id, "Config");
                        if (viewModel.admision)
                            await _userManager.AddToRoleAsync(user.Id, "Admisión");
                        if (viewModel.agenda)
                            await _userManager.AddToRoleAsync(user.Id, "Agenda");
                        if (viewModel.triaje)
                            await _userManager.AddToRoleAsync(user.Id, "Triaje");
                        if (viewModel.dashboard)
                            await _userManager.AddToRoleAsync(user.Id, "Dashboard");
                        if (viewModel.circuit)
                        {
                            await _userManager.AddToRoleAsync(user.Id, "Circuito");
                            //Save Practices & Exams
                            var appUser = _service.GetUserByUsername(user.UserName);
                            for (int i = 0; i < viewModel.practices.Count; i++)
                            {
                                if (viewModel.practices[i].HasValue)
                                {
                                    var practice = _circuitService.GetPracticeById(i);
                                    appUser.Practices.Add(practice);
                                }
                                
                            }
                            for (int i = 0; i < viewModel.exams.Count; i++)
                            {
                                if (viewModel.exams[i].HasValue)
                                {
                                    var exam = _circuitService.GetExamById(i);
                                    appUser.Exams.Add(exam);
                                }
                            }
                            var result = _service.UpdateUser(appUser);
                        }


                        return Ok(user.Id);
                    }
                    foreach (var error in identityResult.Errors)
                    {
                        ModelState.AddModelError(error, error);
                    }

                    return BadRequest(ModelState);
                }
                catch (Exception ex)
                {
                    BadRequest(ex.Message);
                }
            }
                return BadRequest(ModelState);

        }

        [Authorize]
        [Route("")]
        [HttpPut]
        public async Task<IHttpActionResult> Put(RegisterViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var user = await _userManager.FindByIdAsync(viewModel.id);
                    if (user == null)
                        return NotFound();

                    user.Active = viewModel.active;
                    user.UserName = viewModel.username;
                    user.Email = viewModel.email;
                    user.Names = viewModel.names;
                    user.FatherLastName = viewModel.fatherLastName;
                    user.MotherLastName = viewModel.motherLastName;
                    user.DocumentType = (DocumentType) viewModel.documentTypeId;
                    user.DocumentNumber = viewModel.documentNumber;

                    var identityResult = await _userManager.UpdateAsync(user);


                    if (identityResult.Succeeded)
                    {

                        if (viewModel.adminCompany)
                            await _userManager.AddToRoleAsync(user.Id, "AdministrativoEmpresas");
                        if (viewModel.adminProtocols)
                            await _userManager.AddToRoleAsync(user.Id, "AdministrativoProtocolos");
                        if (viewModel.config)
                            await _userManager.AddToRoleAsync(user.Id, "Config");
                        if (viewModel.admision)
                            await _userManager.AddToRoleAsync(user.Id, "Admisión");
                        if (viewModel.agenda)
                            await _userManager.AddToRoleAsync(user.Id, "Agenda");
                        if (viewModel.triaje)
                            await _userManager.AddToRoleAsync(user.Id, "Triaje");
                        if (viewModel.dashboard)
                            await _userManager.AddToRoleAsync(user.Id, "Dashboard");
                        if (viewModel.circuit)
                        {
                            await _userManager.AddToRoleAsync(user.Id, "Circuito");
                            //Save Practices & Exams
                            var appUser = _service.GetUserByUsername(user.UserName);
                            for (int i = 0; i < viewModel.practices.Count; i++)
                            {
                                if (viewModel.practices[i].HasValue)
                                {
                                    var practice = _circuitService.GetPracticeById(i);
                                    appUser.Practices.Add(practice);
                                }

                            }
                            for (int i = 0; i < viewModel.exams.Count; i++)
                            {
                                if (viewModel.exams[i].HasValue)
                                {
                                    var exam = _circuitService.GetExamById(i);
                                    appUser.Exams.Add(exam);
                                }
                            }
                            var result = _service.UpdateUser(appUser);
                        }


                        return Ok(user.Id);
                    }
                    else
                    {
                        foreach (var error in identityResult.Errors)
                        {
                            ModelState.AddModelError(error, error);
                        }

                        return BadRequest(ModelState);
                    }
                }
                catch (Exception ex)
                {

                    throw ex;
                }
            }
            return BadRequest(ModelState);
        }

        [Authorize]
        [Route("newpassword")]
        [HttpPut]
        public async Task<IHttpActionResult> Put(NewPasswordViewModel viewModel)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    var user = await _userManager.FindByNameAsync(viewModel.username);
                    if (user == null)
                        return NotFound();

                    var identityResult =
                        await
                            _userManager.ChangePasswordAsync(user.Id, viewModel.currentPassword, viewModel.newPassword);

                   if (identityResult.Succeeded)
                   {
                       user.ShouldChangePassword = false;
                       await _userManager.UpdateAsync(user);
                        return Ok(user.Id);
                    }
                    else
                    {
                        foreach (var error in identityResult.Errors)
                        {
                            ModelState.AddModelError(error, error);
                        }

                        return BadRequest(ModelState);
                    }
                }
                catch (Exception ex)
                {

                    throw ex;
                }
            }
            return BadRequest(ModelState);
        }

        [Authorize]
        [Route("active")]
        public IHttpActionResult GetActiveUsers()
        {
            var users = _service.GetActiveUsers().ToList();

            var usersViewModel = new List<UserViewModel>();
            Mapper.Map(users, usersViewModel);
            return Ok(usersViewModel);
        }

        [Authorize]
        [Route("stations/{id}")]
        public IHttpActionResult GetStations(string id)
        {
            var roles =  _userManager.GetRolesAsync(id);
            if (roles.Result.Contains("Circuito"))
            {
                var stations = _service.GetStations(id);
                var result = new UserStationsViewModel {userId = id, stations = stations, selectedStation = stations[0]};
                return Ok(result);
            }
            else return NotFound();
        }
    }
}