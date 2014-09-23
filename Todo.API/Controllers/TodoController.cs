using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http;
using AutoMapper;
using Todo.API.ViewModels;
using Todo.Data;
using Todo.Data.Infrastructure;
using Todo.Model;
using Todo.Model.Models;
using Todo.Services;

namespace Todo.API.Controllers
{

    [RoutePrefix("todo")]
    public class TodoController : ApiController
    {
        private ITodoService _service;

        /// <summary>
        /// Handles initializing shared properties
        /// </summary>
        public TodoController(ITodoService service)
        {
            _service = service;
        }

    }
}