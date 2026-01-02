package com.crhistianm.galloalpha.view.persistence.load

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.crhistianm.galloalpha.data.repository.ExerciseRepository
import com.crhistianm.galloalpha.data.response.ExerciseResponse
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class ExerciseListViewModel @Inject constructor(val repository: ExerciseRepository): ViewModel() {

    private val _uiState: MutableStateFlow<ExerciseUiState> = MutableStateFlow(ExerciseUiState())
    val uiState: StateFlow<ExerciseUiState> = _uiState

    fun loadExerciseList(){
        loadingState(true)
        viewModelScope.launch(Dispatchers.IO) {
            _uiState.update { state ->
                state.copy(exerciseList = repository.findAll())
            }
        }
        loadingState(false)
    }

    private fun loadingState(isLoading: Boolean) {
        _uiState.update { state ->
            state.copy(isLoading = isLoading)
        }
    }


}

data class ExerciseUiState(
    val exerciseList: List<ExerciseResponse> = emptyList(),
    val isLoading: Boolean = true
)