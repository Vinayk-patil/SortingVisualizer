"use client";

import React, { useState, useEffect, useRef } from "react";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";
import { BarChart, Bar, CartesianGrid, Tooltip, XAxis, YAxis, LabelList } from 'recharts';

const SortingVisualizer = () => {
  const [arraySize, setArraySize] = useState(50);
  const [array, setArray] = useState<number[]>([]);
  const [algorithm, setAlgorithm] = useState("selectionSort");
  const [step, setStep] = useState(0);
  const [steps, setSteps] = useState<number[][]>([]);
  const [description, setDescription] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const [activeIndices, setActiveIndices] = useState<number[]>([]);
  const [swapIndices, setSwapIndices] = useState<number[]>([]);
  const [sortedIndices, setSortedIndices] = useState<number[]>([]);

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
    setActiveIndices([]);
    setSwapIndices([]);
    setSortedIndices([]);
  };

  useEffect(() => {
    if (steps.length > 0) {
      setArray(steps[0]);
      setDescription(getStepDescription(algorithm, 0));
      setActiveIndices(getStepDetails(algorithm, 0).activeIndices);
      setSwapIndices(getStepDetails(algorithm, 0).swapIndices);
      setSortedIndices(getStepDetails(algorithm, 0).sortedIndices);
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
      const stepDetails = getStepDetails(algorithm, step + 1);
      setActiveIndices(stepDetails.activeIndices);
      setSwapIndices(stepDetails.swapIndices);
      setSortedIndices(stepDetails.sortedIndices);
    } else {
      setIsRunning(false);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep((prevStep) => prevStep - 1);
      setArray(steps[step - 1]);
      setDescription(getStepDescription(algorithm, step - 1));
      const stepDetails = getStepDetails(algorithm, step - 1);
      setActiveIndices(stepDetails.activeIndices);
      setSwapIndices(stepDetails.swapIndices);
      setSortedIndices(stepDetails.sortedIndices);
    }
  };

  const togglePlayPause = () => {
    setIsRunning((prevState) => !prevState);
  };

  const getStepDescription = (algorithm: string, step: number): string => {
    switch (algorithm) {
      case "bubbleSort":
        if (step < steps.length - 1) {
          const active1 = getStepDetails(algorithm, step).activeIndices[0];
          const active2 = getStepDetails(algorithm, step).activeIndices[1];
          const swap = getStepDetails(algorithm, step).swapIndices.length > 0;
          if (swap) {
            return `Bubble Sort: Comparing ${array[active1]} and ${array[active2]}, swapping to move larger element to the end.`;
          } else {
            return `Bubble Sort: Comparing ${array[active1]} and ${array[active2]}, no swap needed as ${array[active1]} is smaller or equal to ${array[active2]}.`;
          }
        } else {
          return "Bubble Sort: Array is now sorted.";
        }
      case "selectionSort":
        if (step < steps.length - 1) {
          const active1 = getStepDetails(algorithm, step).activeIndices[0];
          const minIndex = getStepDetails(algorithm, step).activeIndices[1];
          const swap = getStepDetails(algorithm, step).swapIndices.length > 0;

          if (swap) {
            return `Selection Sort: Swapping ${array[active1]} with the smallest element ${array[minIndex]}.`;
          } else {
            return `Selection Sort: Current smallest element: ${array[minIndex]}, comparing with ${array[active1]}.`;
          }
        } else {
          return "Selection Sort: Array is now sorted.";
        }
      case "insertionSort":
        if (step < steps.length - 1) {
          const keyIndex = getStepDetails(algorithm, step).activeIndices[0];
          const compareIndex = getStepDetails(algorithm, step).activeIndices[1];
          const swap = getStepDetails(algorithm, step).swapIndices.length > 0;
          if (swap) {
            return `Insertion Sort: Moving ${array[keyIndex]} to its correct position, shifting ${array[compareIndex]} to the right.`;
          } else {
            return `Insertion Sort: Comparing ${array[keyIndex]} with ${array[compareIndex]} to find correct position.`;
          }
        } else {
          return "Insertion Sort: Array is now sorted.";
        }
      case "mergeSort":
        if (step < steps.length - 1) {
          return "Merge Sort: Explanation not implemented"; // More descriptive messages to be added
        } else {
          return "Merge Sort: Array is now sorted.";
        }
      case "quickSort":
        if (step < steps.length - 1) {
          return "Quick Sort: Explanation not implemented"; // More descriptive messages to be added
        } else {
          return "Quick Sort: Array is now sorted.";
        }
      default:
        return "";
    }
  };

  const getStepDetails = (algorithm: string, step: number): { activeIndices: number[], swapIndices: number[], sortedIndices: number[] } => {
    if (algorithm === "bubbleSort") {
      if (step < steps.length - 1) {
        const n = array.length;
        const i = Math.floor(step / (n - 1));
        const j = step % (n - 1);
        if (steps.length > 0 && step < steps.length) {
          if (array[j] > array[j + 1])
            return { activeIndices: [j, j + 1], swapIndices: [j, j + 1], sortedIndices: Array.from({ length: n - i - 1 }, (_, k) => k + n - i - 1) };
          else
            return { activeIndices: [j, j + 1], swapIndices: [], sortedIndices: Array.from({ length: n - i - 1 }, (_, k) => k + n - i - 1) };
        } else
          return { activeIndices: [], swapIndices: [], sortedIndices: [] };
      }
      else
        return { activeIndices: [], swapIndices: [], sortedIndices: Array.from({ length: array.length }, (_, k) => k) };
    }
    else if (algorithm === "selectionSort") {
      if (step < steps.length - 1) {
        if (steps.length > 0 && step < steps.length) {
          const stepDetails = stepsDetailed[step];
          return { activeIndices: stepDetails.activeIndices, swapIndices: stepDetails.swapIndices, sortedIndices: stepDetails.sortedIndices };

        }
        else
          return { activeIndices: [], swapIndices: [], sortedIndices: [] };
      }
      else
        return { activeIndices: [], swapIndices: [], sortedIndices: Array.from({ length: array.length }, (_, k) => k) };
    }
    else if (algorithm === "insertionSort") {
      if (step < steps.length - 1) {
        if (steps.length > 0 && step < steps.length) {
          const stepDetails = stepsDetailed[step];
          return { activeIndices: stepDetails.activeIndices, swapIndices: stepDetails.swapIndices, sortedIndices: stepDetails.sortedIndices };
        } else {
          return { activeIndices: [], swapIndices: [], sortedIndices: [] };
        }
      } else {
        return { activeIndices: [], swapIndices: [], sortedIndices: Array.from({ length: array.length }, (_, k) => k) };
      }

    }
    return { activeIndices: [], swapIndices: [], sortedIndices: [] };
  };


  // Sorting Algorithms with Steps
  const bubbleSortSteps = (arr: number[]): number[][] => {
    const stepsArray: { array: number[], activeIndices: number[], swapIndices: number[], sortedIndices: number[] }[] = [{ array: arr.slice(), activeIndices: [], swapIndices: [], sortedIndices: [] }];
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      let isSwapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        stepsArray.push({ array: arr.slice(), activeIndices: [j, j + 1], swapIndices: [], sortedIndices: Array.from({ length: n - i - 1 }, (_, k) => k + n - i - 1) });
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          isSwapped = true;
          stepsArray.push({ array: arr.slice(), activeIndices: [j, j + 1], swapIndices: [j, j + 1], sortedIndices: Array.from({ length: n - i - 1 }, (_, k) => k + n - i - 1) });
        }
      }
      if (!isSwapped) {
        break;
      }
    }
    return stepsArray.map(step => step.array);
  };

  const [stepsDetailed, setStepsDetailed] = useState<{ array: number[], activeIndices: number[], swapIndices: number[], sortedIndices: number[] }[]>([]);

  const selectionSortSteps = (arr: number[]): number[][] => {
    const stepsArray: { array: number[], activeIndices: number[], swapIndices: number[], sortedIndices: number[] }[] = [];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      let minIndex = i;
      stepsArray.push({ array: arr.slice(), activeIndices: [i, minIndex], swapIndices: [], sortedIndices: Array.from({ length: i }, (_, k) => k) });

      for (let j = i + 1; j < n; j++) {
        stepsArray.push({ array: arr.slice(), activeIndices: [j, minIndex], swapIndices: [], sortedIndices: Array.from({ length: i }, (_, k) => k) });
        if (arr[j] < arr[minIndex]) {
          minIndex = j;
        }
      }

      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
        stepsArray.push({ array: arr.slice(), activeIndices: [i, minIndex], swapIndices: [i, minIndex], sortedIndices: Array.from({ length: i }, (_, k) => k) });
      }
    }
    setStepsDetailed(stepsArray);
    return stepsArray.map(step => step.array);
  };


  const insertionSortSteps = (initialArray: number[]): number[][] => {
    const arr = [...initialArray]; // Create a copy to avoid modifying the original
    const stepsArray: { array: number[], activeIndices: number[], swapIndices: number[], sortedIndices: number[] }[] = [{ array: arr.slice(), activeIndices: [], swapIndices: [], sortedIndices: [] }];
    const n = arr.length;

    for (let i = 1; i < n; i++) {
      let key = arr[i];
      let j = i - 1;
      stepsArray.push({ array: arr.slice(), activeIndices: [i, j], swapIndices: [], sortedIndices: Array.from({ length: i }, (_, k) => k) });
      // Move elements of arr[0..i-1], that are greater than key, to one position ahead
      // of their current position
      while (j >= 0 && arr[j] > key) {
        arr[j + 1] = arr[j];
        j = j - 1;
        stepsArray.push({ array: arr.slice(), activeIndices: [i, j], swapIndices: [j + 1, j], sortedIndices: Array.from({ length: i }, (_, k) => k) }); // j+1 is where swap occurs
      }
      arr[j + 1] = key;
      stepsArray.push({ array: arr.slice(), activeIndices: [i, j], swapIndices: [j + 1, i], sortedIndices: Array.from({ length: i }, (_, k) => k) }); // i is insertion
    }
    setStepsDetailed(stepsArray);
    return stepsArray.map(step => step.array);
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

  const chartData = array.map((value, index) => ({
    index: index,
    value: value,
  }));

  const renderCustomLabel = (props: any) => {
    const { x, y, width, height, value, index } = props;
    const fontSize = Math.min(width / 5, height / 2); // Adjust divisor as needed
    const textAnchor = width > 20 ? 'middle' : 'start'; // Adjust 20 based on minimum bar width you want to display label
    const labelColor = value > 10 ? '#fff' : '#000'; // Adjust 10 based on minimum value you want to display label

    return (
      <text
        x={x + width / 2}
        y={y + height / 2}
        fill={labelColor}
        fontSize={fontSize}
        textAnchor={textAnchor}
        dominantBaseline="middle"
      >
        {value}
      </text>
    );
  };

  const getBarColor = (index: number): string => {
    let barColor = "hsl(var(--default))"; // Default bar color

    if (activeIndices.includes(index)) {
      barColor = "hsl(var(--active-comparison))"; // Active comparison color
    }

    if (swapIndices.includes(index)) {
      barColor = "hsl(var(--swap))"; // Swap color
    }

    if (sortedIndices.includes(index)) {
      barColor = "hsl(var(--sorted))"; // Sorted color
    }

    return barColor;
  };

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
          <div className="relative w-full h-64 bg-muted rounded-md flex items-center justify-center overflow-hidden p-4">
            <BarChart width={500} height={300} data={chartData} clipPath="url(#chartClip)">
              <defs>
                <clipPath id="recharts2-clip">
                  <rect x="0" y="0" width="500" height="300" />
                </clipPath>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill={getBarColor} clipPath="url(#recharts2-clip)">
                <LabelList dataKey="value" content={renderCustomLabel} />
              </Bar>
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
