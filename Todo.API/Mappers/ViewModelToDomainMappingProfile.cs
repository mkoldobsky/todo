using AutoMapper;
using Todo.API.ViewModels;
using Todo.Model.Models;

namespace Todo.API.Mappers
{
    public class ViewModelToDomainMappingProfile : Profile
    {
        public override string ProfileName
        {
            get
            {
                return "ViewModelToDomainMappingProfile";
            }
        }

        protected override void Configure()
        {
            Mapper.CreateMap<RegisterViewModel, ApplicationUser>();
            Mapper.CreateMap<TodoViewModel, Item>();
        }
    }
}