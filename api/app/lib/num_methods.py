import math


def find_first(func, low, high, target=0, tolerance=10e2):
    result = -1
    while low <= high:
        mid = math.floor((low + high) / 2)

        if func(mid) - target <= tolerance:
            result = mid  # Store the index
            high = mid - 1  # Move left to find the first occurrence
        elif func(mid) > target:
            low = mid + 1  # Move right
        else:
            high = mid - 1  # Move left

    return result
