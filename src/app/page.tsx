
"use client";

import React, { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { BarChart, Bar, CartesianGrid, Tooltip, XAxis, YAxis } from 'recharts';

const SortingVisualizer = () => {
  const [arraySize, setArraySize] = useState(50);
  const [array, setArray] = useState<number[]>([]);
  const [algorithm, setAlgorithm] = useState("bubbleSort");
  const [step, setStep] = useState(0);
  const [steps, setSteps] = useState<number[][]>([]);
  const [description, setDescription] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    generateRandomArray();
  }, [arraySize]);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    resetVisualization(newArray);
  };

  const resetVisualization = (initialArray: number[]) => {
    switch (algorithm) {
      case "bubbleSort":
        setSteps(bubbleSortSteps([...initialArray]));
        break;
      case "selectionSort":
        setSteps(selectionSortSteps([...initialArray]));
        break;
      case "insertionSort":
        setSteps(insertionSortSteps([...initialArray]));
        break;
      case "mergeSort":
        setSteps(mergeSortSteps([...initialArray]));
        break;
      case "quickSort":
        setSteps(quickSortSteps([...initialArray]));
        break;
      default:
        setSteps([]);
    }
    setStep(0);
    setDescription("");
  };

  useEffect(() => {
    if (steps.length > 0) {
      setArray(steps[0]);
      setDescription(getStepDescription(algorithm, 0));
    }
  }, [steps, algorithm]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        nextStep();
      }, 50);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, step, steps.length]);

  const nextStep = () => {
    if (step < steps.length - 1) {
      setStep((prevStep) => prevStep + 1);
      setArray(steps[step + 1]);
      setDescription(getStepDescription(algorithm, step + 1));
    } else {
      setIsRunning(false);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
      setArray(steps[step - 1]);
      setDescription(getStepDescription(algorithm, step - 1));
    }
  };

  const togglePlayPause = () => {
    setIsRunning((prevState) => !prevState);
  };

  const getStepDescription = (algorithm: string, step: number): string => {
    // Implement descriptions for each step of each algorithm
    switch (algorithm) {
      case "bubbleSort":
        if (step < steps.length) {
          return `Bubble Sort - Step ${step + 1}`;
        }
        return "Bubble Sort Completed";
      case "selectionSort":
        if (step < steps.length) {
          return `Selection Sort - Step ${step + 1}`;
        }
        return "Selection Sort Completed";
      case "insertionSort":
        if (step < steps.length) {
          return `Insertion Sort - Step ${step + 1}`;
        }
        return "Insertion Sort Completed";
      case "mergeSort":
        if (step < steps.length) {
          return `Merge Sort - Step ${step + 1}`;
        }
        return "Merge Sort Completed";
      case "quickSort":
        if (step < steps.length) {
          return `Quick Sort - Step ${step + 1}`;
        }
        return "Quick Sort Completed";
      default:
        return "";
    }
  };

  // Sorting Algorithms with Steps
  const bubbleSortSteps = (arr: number[]): number[][] => {
    const stepsArray: number[][] = [arr.slice()];
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          stepsArray.push(arr.slice());
        }
      }
    }
    return stepsArray;
  };

  const selectionSortSteps = (arr: number[]): number[][] => {
    const stepsArray: number[][] = [arr.slice()];
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      for (let j = i + 1; j < n; j++) {
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }
      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        stepsArray.push(arr.slice());
      }
    }
    return stepsArray;
  };

  const insertionSortSteps = (arr: number[]): number[][] => {
    const stepsArray: number[][] = [arr.slice()];
    const n = arr.length;
    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j = j - 1;
      }
      arr[j + 1] = key;
      stepsArray.push(arr.slice());
    }
    return stepsArray;
  };

  const mergeSortSteps = (arr: number[]): number[][] => {
    const stepsArray: number[][] = [arr.slice()];

    function merge(arr: number[], l: number, m: number, r: number) {
      const n1 = m - l + 1;
      const n2 = r - m;

      const L: number[] = new Array(n1);
      const R: number[] = new Array(n2);

      for (let i = 0; i < n1; i++)
        L[i] = arr[l + i];
      for (let j = 0; j < n2; j++)
        R[j] = arr[m + 1 + j];

      let i = 0, j = 0, k = l;

      while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
          arr[k] = L[i];
          i++;
        } else {
          arr[k] = R[j];
          j++;
        }
        k++;
        stepsArray.push(arr.slice());
      }

      while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
        stepsArray.push(arr.slice());
      }

      while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
        stepsArray.push(arr.slice());
      }
    }

    function mergeSort(arr: number[], l: number, r: number) {
      if (l >= r) {
        return;
      }
      const m = l + Math.floor((r - l) / 2);
      mergeSort(arr, l, m);
      mergeSort(arr, m + 1, r);
      merge(arr, l, m, r);
    }

    mergeSort(arr, 0, arr.length - 1);
    return stepsArray;
  };

  const quickSortSteps = (arr: number[]): number[][] => {
    const stepsArray: number[][] = [arr.slice()];

    function partition(arr: number[], low: number, high: number) {
      const pivot = arr[high];
      let i = low - 1;

      for (let j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          stepsArray.push(arr.slice());
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      stepsArray.push(arr.slice());
      return i + 1;
    }

    function quickSort(arr: number[], low: number, high: number) {
      if (low < high) {
        const pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
      }
    }

    quickSort(arr, 0, arr.length - 1);
    return stepsArray;
  };

  const getCurrentHighlights = () => {
    if (steps.length === 0 || step >= steps.length) {
      return [];
    }
    return [];
  };

  const chartData = array.map((value, index) => ({
    index: index,
    value: value,
  }));

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-secondary">
      <Card className="w-full max-w-4xl shadow-md rounded-lg overflow-hidden">
        <CardHeader className="py-4">
          <CardTitle className="text-center text-2xl">SortVision</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 p-6">
          {/* Array Controls */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="arraySize" className="text-sm font-medium">
                Array Size:
              </label>
              <div className="w-24">
                <Input
                  type="number"
                  id="arraySize"
                  value={arraySize}
                  onChange={(e) => setArraySize(Number(e.target.value))}
                  className="text-sm"
                />
              </div>
              <Slider
                defaultValue={[arraySize]}
                max={100}
                step={1}
                onValueChange={(value) => setArraySize(value[0])}
                className="w-48"
              />
            </div>
            <Button onClick={generateRandomArray}>Generate New Array</Button>
          </div>

          {/* Algorithm Selection */}
          <div className="flex items-center justify-between gap-4">
            <Select onValueChange={(value) => setAlgorithm(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Algorithm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bubbleSort">Bubble Sort</SelectItem>
                <SelectItem value="selectionSort">Selection Sort</SelectItem>
                <SelectItem value="insertionSort">Insertion Sort</SelectItem>
                   <SelectItem value="mergeSort">Merge Sort</SelectItem>
                   <SelectItem value="quickSort">Quick Sort</SelectItem>
              </SelectContent>
            </Select>

            {/* Step Controls */}
            <div className="flex items-center gap-2">
              <Button onClick={prevStep} disabled={step === 0}>
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <Button onClick={togglePlayPause}>
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isRunning ? "Pause" : "Play"}
              </Button>
              <Button onClick={nextStep} disabled={step === steps.length - 1}>
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Bar Visualization */}
          <div className="relative w-full h-64 bg-muted rounded-md flex items-center justify-center overflow-hidden">
            <BarChart width={500} height={300} data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </div>

          {/* Textual Explanation */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SortingVisualizer;
