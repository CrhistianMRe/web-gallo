package com.crhistianm.galloalpha.data.repository

import com.crhistianm.galloalpha.data.datasource.api.WorkoutApiService
import com.crhistianm.galloalpha.data.response.WorkoutResponse
import javax.inject.Inject

class WorkoutRepositoryImpl @Inject constructor(val api: WorkoutApiService): WorkoutRepository{

    override suspend fun findAll(): List<WorkoutResponse> {
        return api.viewAll()
    }
}