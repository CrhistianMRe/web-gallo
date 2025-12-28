package com.crhistianm.galloalpha.view.persistence.load

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.crhistianm.galloalpha.data.repository.WorkoutRepository
import com.crhistianm.galloalpha.data.response.WorkoutResponse
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class WorkoutListViewModel @Inject constructor(val repository: WorkoutRepository): ViewModel() {

    private val _uiState = MutableStateFlow(WorkoutUiState())
    val uiState: StateFlow<WorkoutUiState> = _uiState

    fun loadWorkoutList() {
        loadingState(true)
        viewModelScope.launch(Dispatchers.IO){
            _uiState.update { state ->
                state.copy(workoutList = repository.findAll().map { it ->
                    it.copy(workoutDate = it.workoutDate.removeRange(10, 24))
                })
            }
        }
        loadingState(false)
    }

    private fun loadingState(isLoading: Boolean){
        _uiState.update { state ->
            state.copy(isLoading = isLoading)
        }
    }

}

data class WorkoutUiState(
    val workoutList: List<WorkoutResponse> = emptyList<WorkoutResponse>(),
    val isLoading: Boolean = true
)

