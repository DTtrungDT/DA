﻿using MediatR;
using SocialNetworkWebApp.Models;
using SocialNetworkWebApp.Repositories.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace SocialNetworkWebApp.UseCases.Handlers
{
    public class GetAllMessagesByChatroomIdRequestHandler :
        IRequestHandler<GetAllMessagesByChatroomIdRequest, IEnumerable<MessageEntity>>
    {
        private readonly IRepository<MessageEntity> _repository;

        public GetAllMessagesByChatroomIdRequestHandler(IRepository<MessageEntity> repository)
        {
            _repository = repository;
        }

        public async Task<IEnumerable<MessageEntity>> Handle(GetAllMessagesByChatroomIdRequest request, CancellationToken cancellationToken)
        {
            var listMessages = await _repository.GetAll();
            listMessages = listMessages
                .Where(message => message.ChatroomId == request.ChatroomId)
                .OrderBy(message => message.CreatedTime);

            if (request.GetLatest && listMessages.Count() > 0)
            {
                var tmpList = new List<MessageEntity>();
                tmpList.Add(listMessages.Last());
                listMessages = tmpList;
            }

            return listMessages;
        }
    }
}
