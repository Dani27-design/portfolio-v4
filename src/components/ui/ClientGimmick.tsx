'use client';

import dynamic from 'next/dynamic';
import { LazyGimmick } from './LazyGimmick';

const gimmicks = {
  system: dynamic(() => import('@/components/gimmicks/SystemGimmick').then(m => ({ default: m.SystemGimmick })), { ssr: false }),
  network: dynamic(() => import('@/components/gimmicks/NetworkTopologyGimmick').then(m => ({ default: m.NetworkTopologyGimmick })), { ssr: false }),
  trajectory: dynamic(() => import('@/components/gimmicks/TacticalTrajectoryGimmick').then(m => ({ default: m.TacticalTrajectoryGimmick })), { ssr: false }),
  architecture: dynamic(() => import('@/components/gimmicks/ArchitectureSchematicGimmick').then(m => ({ default: m.ArchitectureSchematicGimmick })), { ssr: false }),
  serviceCluster: dynamic(() => import('@/components/gimmicks/ServiceClusterGimmick').then(m => ({ default: m.ServiceClusterGimmick })), { ssr: false }),
  logStream: dynamic(() => import('@/components/gimmicks/LogStreamGimmick').then(m => ({ default: m.LogStreamGimmick })), { ssr: false }),
  neuralBridge: dynamic(() => import('@/components/gimmicks/NeuralBridgeGimmick').then(m => ({ default: m.NeuralBridgeGimmick })), { ssr: false }),
  kernelSubstrate: dynamic(() => import('@/components/gimmicks/KernelSubstrateGimmick').then(m => ({ default: m.KernelSubstrateGimmick })), { ssr: false }),
};

export type GimmickName = keyof typeof gimmicks;

export function ClientGimmick({ name }: { name: GimmickName }) {
  const Gimmick = gimmicks[name];
  return (
    <LazyGimmick>
      <Gimmick />
    </LazyGimmick>
  );
}
