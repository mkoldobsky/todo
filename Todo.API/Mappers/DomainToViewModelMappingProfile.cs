using System.Linq;
using AutoMapper;
using Todo.API.ViewModels;
using Todo.Model.Models;

namespace Todo.API.Mappers
{
    public class DomainToViewModelMappingProfile : Profile
    {
        public override string ProfileName
        {
            get
            {
                return "DomainToViewModelMappingProfile";
            }
        }


        protected override void Configure()
        {
            Mapper.CreateMap<ApplicationUser, RegisterViewModel>();
            Mapper.CreateMap<Item, TodoViewModel>();
        }
    }
}