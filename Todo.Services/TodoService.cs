using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Todo.Data.Infrastructure;
using Todo.Data.Repositories;
using Todo.Model.Models;

namespace Todo.Services
{
    public class TodoService : ITodoService
    {
        private readonly ITodoRepository _repository;
        private readonly IUnitOfWork _unitOfWork;

        public TodoService(ITodoRepository repository, IUnitOfWork unitOfWork)
        {
            _repository = repository;
            _unitOfWork = unitOfWork;
        }

    }
}
