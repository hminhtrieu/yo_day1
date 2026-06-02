package com.yo.day1.service.impl;

import com.yo.day1.common.exception.NotFoundException;
import com.yo.day1.domain.entity.Parent;
import com.yo.day1.dto.parent.ParentResponse;
import com.yo.day1.dto.parent.ParentUpsertRequest;
import com.yo.day1.repository.CourseRepository;
import com.yo.day1.repository.ParentRepository;
import com.yo.day1.service.ParentService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ParentServiceImpl implements ParentService {
    private final ParentRepository parentRepository;
    private final ModelMapper mapper;
    private final CourseRepository courseRepository;

    private ParentResponse map(Parent parent)
    {
        return mapper.map(parent,ParentResponse.class);
    }


    public List<ParentResponse> findAll()
    {
        return parentRepository.findAll().stream()
                .map(s-> map(s))
                .toList();
    }

    public Optional<ParentResponse> findById(Long id)
    {
        return parentRepository.findById(id).map(this::map);
    }

    public ParentResponse create(ParentUpsertRequest request)
    {
        Parent parent = mapper.map(request,Parent.class);
        Parent result = parentRepository.save(parent);
        return map((result));
    }

    public ParentResponse update(ParentUpsertRequest request,Long id)
    {
        Parent parent = mapper.map(request,Parent.class);
        parent.setId(id);
        Parent result = parentRepository.save(parent);
        return map((result));
    }
    public void deleteById(Long id) throws NotFoundException
    {
        if(courseRepository.existsById(id))
        {
            courseRepository.deleteById(id);

        }
        else
        {
            throw new NotFoundException("Khong tim thay parent");
        }

    }
}
