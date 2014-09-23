using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using Todo.Data.Infrastructure;
using Todo.Data.Repositories;
using Todo.Model.Models;

namespace Todo.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly IUnitOfWork _unitOfWork;
        public UserService(IUserRepository userRepository,IUnitOfWork unitOfWork)
        {
            this._userRepository = userRepository;
            this._unitOfWork = unitOfWork;
        }
     

        public ApplicationUser RegisterUser(ApplicationUser user)
        {
            user = _userRepository.Add(user);
            SaveChanges();
            return user;
        }

        public IEnumerable<ApplicationUser> GetAll()
        {
            return _userRepository.GetAll();
        }

        public ApplicationUser GetUserByUsername(string userName)
        {
            return _userRepository.GetByUsername(userName);
        }

        public bool UpdateUser(ApplicationUser user)
        {
            try
            {
                _userRepository.Update(user);
                _unitOfWork.SaveChanges();

            }
            catch (Exception)
            {
                
                return false;
            }
            return true;
        }


        public ApplicationUser GetUserByEmail(string email)
        {
           var user = _userRepository.GetMany(u => u.Email == email).FirstOrDefault();
           return user;
        }

        public void SaveChanges()
        {
            _unitOfWork.SaveChanges();
        }

    }

    public interface IUserService
    {
        IEnumerable<ApplicationUser> GetAll();
        ApplicationUser GetUserByUsername(string userName);
        bool UpdateUser(ApplicationUser user);
    }
}
